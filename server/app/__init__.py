from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_restless import APIManager
from flask_migrate import Migrate
from flask_cors import CORS

# Initiate Flask
app = Flask(__name__,
            instance_relative_config=True,
            static_folder="../../client/",
            static_url_path="/client")

# Load config
app.config.from_pyfile('config.py')

# Setup main route
@app.route('/')
def index():
    return current_app.send_static_file('app/layout/index.html')

# Apply Cors
CORS(app)

# Set Up Database
db = SQLAlchemy(app)
migrate = Migrate(app, db)
import app.models as models


# Database Functions
def dummy_scores(result):
    """ Pad new assignments with Dummy Scores """

    # Get students assigned to this year
    req_year = result['subject']['year_id']
    sinfo = models.Students.query.filter_by(year_id=req_year).all()
    print(sinfo)

    # Loop through and add dummy scores
    for i, student in enumerate(sinfo):
        print(student)
        models.Scores.add_dummy(student.id, result['id'])

    return "Dummys Added"

# Set up Flask-Restless APIs
manager = APIManager(app, flask_sqlalchemy_db=db)
httpmeths = ['GET', 'POST', 'DELETE', 'PUT']

manager.create_api(models.Users, methods=httpmeths)
manager.create_api(models.Years, methods=httpmeths)
manager.create_api(models.Students, methods=httpmeths)
manager.create_api(models.Subjects, methods=httpmeths, include_columns=['id', 'name'])
manager.create_api(models.Assignments, methods=httpmeths, postprocessors={'POST': [dummy_scores]})
manager.create_api(models.Scores, methods=httpmeths)
