from . import db


# Years Table
class Years(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school = db.Column(db.String(255))
    year = db.Column(db.Integer)
    student = db.relationship('Students', backref='yearref', lazy='dynamic')
    subject = db.relationship('Subjects', backref='yearref', lazy='dynamic')
    cycle = db.relationship('Cycles', backref='yearref', lazy='dynamic')

    @classmethod
    def get(cls, yid):
        return cls.query.get(yid)


# Students Table
class Students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    unique = db.Column(db.Integer)
    score = db.relationship('Scores', backref='studref', lazy='dynamic')

    @classmethod
    def get_students(cls, yid):
        return cls.query.filter_by(yearid=yid).order_by('first_name').all()

    @classmethod
    def set_unique(cls, id, uindex):
        student = cls.query.get(id)
        student.unique = uindex
        db.session.commit()

# Subjects Table
class Subjects(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    assign = db.relationship('Assignments', backref='subref', lazy='dynamic')


# Cycle
class Cycles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    start = db.Column(db.Date)
    end = db.Column(db.Date)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))


# Assignments Table
class Assignments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    date = db.Column(db.Date)
    type = db.Column(db.String(255))
    max = db.Column(db.Integer)
    subjid = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    score = db.relationship('Scores', backref='assref', lazy='dynamic')


# Scores
class Scores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignid = db.Column(db.Integer, db.ForeignKey('assignments.id'))
    stuid = db.Column(db.Integer, db.ForeignKey('students.id'))
    value = db.Column(db.Integer)
