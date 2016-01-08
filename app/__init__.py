from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager

# Initiate Flask
app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
app.config.from_pyfile('config.py')

# Connect to database
db = SQLAlchemy(app)

# Import Blueprints
from .views.home import home
from .views.add import add

# Blueprints
app.register_blueprint(home)
app.register_blueprint(add)

# Final Import
from app import models, views

# Create API
manager = APIManager(app, flask_sqlalchemy_db=db)
manager.create_api(models.Years, methods=['GET', 'POST', 'DELETE', 'PUT'])
manager.create_api(models.Subjects, methods=['GET', 'POST', 'DELETE', 'PUT'])
manager.create_api(models.Assignments, methods=['GET', 'POST', 'DELETE', 'PUT'])
manager.create_api(models.Scores, methods=['GET', 'POST', 'DELETE', 'PUT'])
