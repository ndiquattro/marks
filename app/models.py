from . import db


# Years Table
class Years(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school = db.Column(db.String(64), index=True, unique=False)
    year = db.Column(db.Integer, index=True, unique=False)
    student = db.relationship('Students', backref='yearref', lazy='dynamic')
    subject = db.relationship('Subjects', backref='yearref', lazy='dynamic')
    # cycle = db.relationship('Cycles', backref='yearref', lazy='dynamic')


# Students Table
class Students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    first_name = db.Column(db.String(64), index=True, unique=False)
    last_name = db.Column(db.String(64), index=True, unique=False)
    score = db.relationship('Scores', backref='studref', lazy='dynamic')


# Subjects Table
class Subjects(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(64), index=True, unique=False)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    assign = db.relationship('Assignments', backref='subref', lazy='dynamic')


# Cycle
class Cycles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=False)
    start = db.Column(db.Date)
    end = db.Column(db.Date)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))


# Assignments Table
class Assignments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=False)
    date = db.Column(db.Date)
    type = db.Column(db.String(64))
    subjid = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    score = db.relationship('Scores', backref='assref', lazy='dynamic')


# Scores
class Scores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignid = db.Column(db.Integer, db.ForeignKey('assignments.id'))
    stuid = db.Column(db.Integer, db.ForeignKey('students.id'))
    value = db.Column(db.Integer)
