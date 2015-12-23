from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

# Initiate Flask
app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
app.config.from_pyfile('config.py')

# Connect to database
db = SQLAlchemy(app)

# Import Blueprints
from .views.home import home

# Blueprints
app.register_blueprint(home)

# Final Import
from app import models, views
