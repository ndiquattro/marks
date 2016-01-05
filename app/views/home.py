from flask import Blueprint, render_template, session
# Register blueprint
home = Blueprint('home', __name__)


@home.route('/')
def index():
    return render_template('angver.html')
