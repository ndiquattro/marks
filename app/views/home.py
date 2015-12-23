from flask import Blueprint, render_template

# Register blueprint
home = Blueprint('home', __name__)


@home.route('/')
def index():
    return render_template('index.html')
