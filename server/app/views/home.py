from flask import Blueprint, current_app

# Register blueprint
home = Blueprint('home', __name__)


@home.route('/')
def index():
    return current_app.send_static_file('app/layout/index.html')
