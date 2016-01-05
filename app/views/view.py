from flask import (Blueprint, render_template, session, redirect, url_for,
                   flash, jsonify)
from ..models import Subjects, Assignments, Scores, Students
from .. import db
from ..forms.editscores import EditScores, ScoreForm

# Register blueprint
view = Blueprint('view', __name__, url_prefix="/view")


# Grand Overview
@view.route('/')
def gview(sub=None, assm=None):
    # Look up subjects
    subs = Subjects.allsubs(session['yearid'])

    # Get Names
    subnames = [{'id': sub.id, 'name': sub.name} for sub in subs]
    print subnames

    return jsonify(data=subnames)
    # return render_template('view/viewbase.html',
    #                        subs=subs,
    #                        sub=sub,
    #                        assm=assm)


@view.route('/<sub>')
def subview(sub):
    # Look up subjects
    subs = Subjects.allsubs(session['yearid'])

    # Look up Assignments for this subject
    cursub = Subjects.lookup(sub)
    assms = Assignments.lookup_sub(cursub.id)

    return render_template('view/viewbase.html',
                           subs=subs,
                           csub=sub,
                           assms=assms)


@view.route('/<sub>/<int:assmid>', methods=['GET', 'POST'])
def assmview(sub, assmid):
    # Look up subjects
    subs = Subjects.allsubs(session['yearid'])

    # Look up Assignments for this subject
    cursub = Subjects.lookup(sub)
    assms = Assignments.lookup_sub(cursub.id)

    # Join query
    data = db.session.query(Students, Scores).outerjoin(Scores)\
        .filter(Scores.assignid == assmid).order_by('first_name').all()

    # Create Score forms
    form = EditScores()

    if form.validate_on_submit():
        # Iterate and update scores
        for score in form.scores.data:
            Scores.update({'stuid': score['stuid'],
                           'assignid': int(assmid),
                           'value': score['score']})

        flash('Scores Updated!')
        return redirect(url_for('view.assmview', sub=sub, assmid=assmid))
    else:
        for student, score in data:
            stuscore = ScoreForm()
            stuscore.firstname = student.first_name
            stuscore.stuid = int(student.id)
            stuscore.score = score.value
            form.scores.append_entry(stuscore)

    return render_template('view/viewbase.html',
                           subs=subs,
                           csub=sub,
                           assms=assms,
                           cassm=assmid,
                           scores=form)
