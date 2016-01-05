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
from .views.add import add
from .views.view import view

# Blueprints
app.register_blueprint(home)
app.register_blueprint(add)
app.register_blueprint(view)

# Final Import
from app import models, views
