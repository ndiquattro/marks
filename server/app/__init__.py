from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager

from flask_cors import CORS, cross_origin

# Initiate Flask
app = Flask(__name__,
            instance_relative_config=True,
            static_folder="../../client/",
            static_url_path="/client")
app.config.from_object('config')
app.config.from_pyfile('config.py')

CORS(app)

# Connect to database
db = SQLAlchemy(app)

# Import Blueprints
from views.home import home
from views.sesh import sesh
from views.dbfunctions import dbfunctions, dummy_scores

# Blueprints
app.register_blueprint(home)
app.register_blueprint(sesh)
app.register_blueprint(dbfunctions)

# Final Import
from app.models import gbookdb

# Create API
manager = APIManager(app, flask_sqlalchemy_db=db)
httpmeths = ['GET', 'POST', 'DELETE', 'PUT']

manager.create_api(gbookdb.Years, methods=httpmeths)
manager.create_api(gbookdb.Students, methods=httpmeths, results_per_page=None)
manager.create_api(gbookdb.Cycles, methods=httpmeths)
manager.create_api(gbookdb.Subjects, methods=httpmeths, include_columns=['id', 'name'])
manager.create_api(gbookdb.Assignments, methods=httpmeths,
                   exclude_columns=['score'], postprocessors={'POST': [dummy_scores]})

manager.create_api(gbookdb.Scores, methods=httpmeths, results_per_page=None)
