from app import db
from crud_mixin import CRUDMixin


# Years Table
class Years(db.Model, CRUDMixin):
    school = db.Column(db.String(255))
    year = db.Column(db.Integer)
    student = db.relationship('Students', backref='yearref', lazy='dynamic')
    subject = db.relationship('Subjects', backref='yearref', lazy='dynamic')
    cycle = db.relationship('Cycles', backref='yearref', lazy='dynamic')


# Students Table
class Students(db.Model, CRUDMixin):
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    unique = db.Column(db.Integer)
    score = db.relationship('Scores', backref='studref', lazy='dynamic')

    @classmethod
    def set_unique(cls, stuid, uindex):
        student = cls.query.get(stuid)
        student.unique = uindex
        db.session.commit()


# Subjects Table
class Subjects(db.Model, CRUDMixin):
    name = db.Column(db.String(255))
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    assign = db.relationship('Assignments', backref='subref', lazy='dynamic')


# Cycle
class Cycles(db.Model, CRUDMixin):
    name = db.Column(db.String(255))
    start = db.Column(db.Date)
    end = db.Column(db.Date)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))


# Assignments Table
class Assignments(db.Model, CRUDMixin):
    name = db.Column(db.String(255))
    date = db.Column(db.Date)
    type = db.Column(db.String(255))
    max = db.Column(db.Integer)
    subjid = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    score = db.relationship('Scores', backref='assref', lazy='dynamic')


# Scores
class Scores(db.Model, CRUDMixin):
    assignid = db.Column(db.Integer, db.ForeignKey('assignments.id'))
    stuid = db.Column(db.Integer, db.ForeignKey('students.id'))
    value = db.Column(db.Integer)

    @classmethod
    def add_dummy(cls, stuid, assignid):
        db.session.add(Scores(stuid=stuid, assignid=assignid, value=0))
        db.session.commit()
