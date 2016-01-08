from flask import Blueprint, render_template, flash, redirect, url_for, session
from ..models import Years, Students, Subjects, Assignments, Scores
from app.forms import addforms

# Register blueprint
add = Blueprint('add', __name__, url_prefix="/add")


@add.route('/year', methods=['GET', 'POST'])
def add_year():
    # Make form
    ayform = addforms.AddYear()

    if ayform.validate_on_submit():
        # Add to database
        yid = Years.add({'year': int(ayform.year.data.year),
                         'school': ayform.school.data})

        # Make new year the active year
        session.permanent = True
        session['yearid'] = yid
        session['yearlab'] = ayform.year.data.year
        session['school'] = ayform.school.data

        # Notify User
        flash('Added "%s" at %s' % (str(ayform.year.data.year),
                                    ayform.school.data))

        return redirect(url_for('home.index'))

    return render_template('add/year.html', form=ayform)


@add.route('/students', methods=['GET', 'POST'])
def add_students():
    # Make Forms
    form = addforms.AddStudents()

    if form.validate_on_submit():
        # Get active year info
        yinfo = Years.lookup(session['yearid'])

        # Add to database
        Students.add({'first_name': form.fname.data,
                      'last_name': form.lname.data,
                      'yearref': yinfo})

        # Notify User
        flash('Added %s %s to year %s' % (form.fname.data, form.lname.data,
                                      yinfo.year))

        return redirect(url_for('add.add_students'))

    return render_template('add/students.html', form=form)


@add.route('/subject', methods=['GET', 'POST'])
def add_subject():
    # Make Forms
    form = addforms.AddSubject()

    if form.validate_on_submit():
        # Get active year info
        yinfo = Years.lookup(session['yearid'])

        # Add to database
        Subjects.add({'name': form.name.data,
                      'yearref': yinfo})

        # Notify User
        flash('Added %s to year %s' % (form.name.data, yinfo.year))

        return redirect(url_for('add.add_subject'))

    return render_template('add/subject.html', form=form)


@add.route('/assignment', methods=['GET', 'POST'])
def add_assignment():
    # Make Forms
    form = addforms.AddAssignment()

    # Add subject choices
    form.subject.choices = [(str(x.id), x.name)
                            for x in Subjects.allsubs(session['yearid'])]

    if form.validate_on_submit():
        # Get subject info
        print form.subject.data
        sinfo = Subjects.lookup(form.subject.data)

        # Add to database
        newassm = Assignments.add({'name': form.name.data,
                                 'date': form.date.data,
                                 'type': form.scty.data,
                                 'subref': sinfo})

        # Get Students
        studs = Students.get_all(session['yearid'])

        # Add NULL default Scores
        for student in studs:
            info = {'value': 0,
                    'studref': student,
                    'assref': newassm}
            Scores.add(info)

        # Notify User
        flash('Added %s to %s' % (form.name.data, sinfo.name))

        return redirect(url_for('add.add_assignment'))

    return render_template('add/assignment.html', form=form)
