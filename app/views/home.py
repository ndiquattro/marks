from flask import Blueprint, current_app, session, jsonify
from ..models import Years

# Register blueprint
home = Blueprint('home', __name__)


@home.route('/')
def index():
    return current_app.send_static_file('app/layout/index.html')


@home.route('/api/_setyear/<int:yearid>', methods=['POST'])
def setyear(yearid):
    # Make new year the active year
    session.permanent = True
    session['yearid'] = yearid

    return jsonify(data="OK")


@home.route('/api/_curyear')
def curyear():
    # Query
    cyear = Years.get(session['yearid'])

    # Parse query
    data = {'id': cyear.id, 'year': cyear.year, 'school': cyear.school}

    return jsonify(data=data)
