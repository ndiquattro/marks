from flask import Blueprint, session, jsonify
from ..models.gbookdb import Years

# Register blueprint
sesh = Blueprint('sesh', __name__, url_prefix='/sesh')


@sesh.route('/_setyear/<int:yearid>', methods=['POST'])
def setyear(yearid):
    # Make new year the active year
    session.permanent = True
    session['yearid'] = yearid

    return jsonify(data="OK")


@sesh.route('/_curyear')
def curyear():
    # Query
    cyear = Years.get(session['yearid'])

    # Parse query
    data = {'id': cyear.id, 'year': cyear.year, 'school': cyear.school}

    return jsonify(data)
