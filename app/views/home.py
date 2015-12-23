from flask import Blueprint

# Register blueprint
home = Blueprint('home', __name__)


@home.route('/')
def index():
    return "Hello World!"
