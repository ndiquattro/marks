from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_restless import APIManager
from flask_migrate import Migrate
from flask_security import SQLAlchemyUserDatastore, Security
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_mail import Mail

from flask_cors import CORS

# Initiate Flask
app = Flask(__name__,
            instance_relative_config=True,
            static_folder="../../client/",
            static_url_path="")

# Load config
app.config.from_pyfile('config.py')



# Setup main route
if app.config['LOCATION'] is 'local':
    @app.route('/')
    def index():
        return current_app.send_static_file('index.html')

# Apply Cors
CORS(app)

# Set Up Database
db = SQLAlchemy(app)
migrate = Migrate(app, db)
import app.models as models

# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, models.Users, models.Roles)
security = Security(app, user_datastore)

# Setup Flask-Mail
mail = Mail(app)

# Setup the Flask-JWT-Extended extension
jwt = JWTManager(app)

# Register Blueprints
from app.auth import auth
app.register_blueprint(auth)

# Database Functions
def dummy_scores(result):
    """ Pad new assignments with Dummy Scores """

    # Get students assigned to this year
    req_year = result['subject']['year_id']
    req_user = result['user_id']
    sinfo = models.Students.query.filter_by(year_id=req_year, user_id=req_user).all()

    # Loop through and add dummy scores
    for i, student in enumerate(sinfo):
        print(student)
        models.Scores.add_dummy(student.id, result['id'], req_user)

    return "Dummys Added"

# Set up Flask-Restless APIs
@jwt_required
def auth_func(search_params, **kw):
    user_filter = {'name': 'user_id', 'op': 'eq', 'val': get_jwt_identity()}
    if 'filters' in search_params:
        search_params['filters'].append(user_filter)
    else:
        search_params['filters'] = [user_filter]
    return True

@jwt_required
def add_pre(data):
    data['user_id'] = get_jwt_identity()
    return True

uni_preprocs = dict(POST=[add_pre], GET=[auth_func], DELETE=[auth_func],
                    PUT=[auth_func], GET_MANY=[auth_func])

manager = APIManager(app, flask_sqlalchemy_db=db, preprocessors=uni_preprocs)
httpmeths = ['GET', 'POST', 'DELETE', 'PUT']

manager.create_api(models.Users, methods=httpmeths, exclude_columns=['password', 'years', 'scores', 'students', 'subjects', 'assigments'])
manager.create_api(models.Years, methods=httpmeths, exclude_columns=['user'])
manager.create_api(models.Students, methods=httpmeths, results_per_page=-1, exclude_columns=['user'])
manager.create_api(models.Subjects, methods=httpmeths, include_columns=['id', 'name'])
manager.create_api(models.Assignments, methods=httpmeths, postprocessors={'POST': [dummy_scores]}, exclude_columns=['user', 'scores'])
manager.create_api(models.Scores, methods=httpmeths, exclude_columns=['user'])
