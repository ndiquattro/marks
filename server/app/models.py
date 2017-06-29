from app import db

# Users Table
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    salutation = db.Column(db.String(4))
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    subscribed = db.Column(db.Boolean)
    created = db.Column(db.Date)

# Years Table
class Years(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school = db.Column(db.String(255))
    first_day = db.Column(db.Date)
    last_day = db.Column(db.Date)
    students = db.relationship('Students', backref='year', lazy='dynamic')
    subjects = db.relationship('Subjects', backref='year', lazy='dynamic')

# Students Table
class Students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    unique = db.Column(db.Integer)
    scores = db.relationship('Scores', backref='student', lazy='dynamic')
    year_id = db.Column(db.Integer, db.ForeignKey('years.id'))

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


# Assignments Table
class Assignments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    date = db.Column(db.Date)
    type = db.Column(db.String(255))
    max = db.Column(db.Integer)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    scores = db.relationship('Scores', backref='assignment', lazy='dynamic')


# Scores
class Scores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'))
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))

    @classmethod
    def add_dummy(cls, stuid, assignid):
        db.session.add(Scores(student_id=stuid, assignment_id=assignid,
                       value=0))
        db.session.commit()
