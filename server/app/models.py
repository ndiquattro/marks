from app import db
from flask_security import UserMixin, RoleMixin

# Users Table
roles_users = db.Table('roles_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('users.id')),
        db.Column('role_id', db.Integer(), db.ForeignKey('roles.id')))

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(4))
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    subscribed = db.Column(db.Boolean)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(50))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    active_year = db.Column(db.Integer())
    years = db.relationship('Years', backref='user', lazy='dynamic')
    students = db.relationship('Students', backref='user', lazy='dynamic')
    subjects = db.relationship('Subjects', backref='user', lazy='dynamic')
    assignments = db.relationship('Assignments', backref='user', lazy='dynamic')
    scores = db.relationship('Scores', backref='user', lazy='dynamic')
    roles = db.relationship('Roles', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))

class Roles(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

# Years Table
class Years(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school = db.Column(db.String(255))
    first_day = db.Column(db.Date)
    last_day = db.Column(db.Date)
    students = db.relationship('Students', backref='year', lazy='dynamic')
    subjects = db.relationship('Subjects', backref='year', lazy='dynamic')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

# Students Table
class Students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    unique = db.Column(db.Integer)
    scores = db.relationship('Scores', backref='student', lazy='dynamic')
    year_id = db.Column(db.Integer, db.ForeignKey('years.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @classmethod
    def set_unique(cls, stuid, uindex):
        student = cls.query.get(stuid)
        student.unique = uindex
        db.session.commit()


# Subjects Table
class Subjects(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    year_id = db.Column(db.Integer, db.ForeignKey('years.id'))
    assignments = db.relationship('Assignments', backref='subject', lazy='dynamic')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


# Assignments Table
class Assignments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    date = db.Column(db.Date)
    type = db.Column(db.String(255))
    max = db.Column(db.Integer)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    scores = db.relationship('Scores', backref='assignment', lazy='dynamic')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


# Scores
class Scores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'))
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @classmethod
    def add_dummy(cls, stuid, assignid, userid):
        db.session.add(Scores(student_id=stuid, assignment_id=assignid,
                       value=0, user_id=userid))
        db.session.commit()
