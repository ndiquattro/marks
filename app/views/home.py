from flask import Blueprint, render_template, redirect, url_for, session

# Register blueprint
home = Blueprint('home', __name__)


@home.route('/')
def index():
    return redirect(url_for('home.gradebook'))


@home.route('/admin')
def admin():
    return render_template('admin.html')


@home.route('/gradebook')
def gradebook():
    return render_template('gradebook.html')


@home.route('/_setyear/<int:yearid>')
def setyear(yearid):
    # Make new year the active year
    session.permanent = True
    session['yearid'] = yearid