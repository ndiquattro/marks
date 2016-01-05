from . import db


# Years Table
class Years(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school = db.Column(db.String(64), index=True, unique=False)
    year = db.Column(db.Integer, index=True, unique=False)
    student = db.relationship('Students', backref='yearref', lazy='dynamic')
    subject = db.relationship('Subjects', backref='yearref', lazy='dynamic')
    cycle = db.relationship('Cycles', backref='yearref', lazy='dynamic')

    def __repr__(self):
        return '<User %r>' % self.firstname

    @classmethod
    def add(cls, yinfo):
        newyear = cls(**yinfo)
        db.session.add(newyear)
        db.session.commit()

        return newyear.id

    @classmethod
    def lookup(cls, yid):
        return cls.query.filter_by(id=yid).first()


# Students Table
class Students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    first_name = db.Column(db.String(64), index=True, unique=False)
    last_name = db.Column(db.String(64), index=True, unique=False)
    score = db.relationship('Scores', backref='studref', lazy='dynamic')

    @classmethod
    def add(cls, sinfo):
        newstudent = cls(**sinfo)
        db.session.add(newstudent)
        db.session.commit()

    @classmethod
    def get_all(cls, yearid):
        return cls.query.filter_by(yearid=yearid).all()


# Subjects Table
class Subjects(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=False)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    assign = db.relationship('Assignments', backref='subref', lazy='dynamic')

    @classmethod
    def add(cls, sinfo):
        newrec = cls(**sinfo)
        db.session.add(newrec)
        db.session.commit()

    @classmethod
    def lookup(cls, sname):
        return cls.query.filter_by(name=sname).first()

    @classmethod
    def allsubs(cls, yearid):
        return cls.query.filter_by(yearid=yearid).order_by('name').all()


# Cycle
class Cycles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=False)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    # assign = db.relationship('Assignments', backref='cycref', lazy='dynamic')


# Assignments Table
class Assignments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=False)
    date = db.Column(db.Date)
    type = db.Column(db.String(64))
    subjid = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    # cycle = db.Column(db.Integer, db.ForeignKey('cycles.id'))
    score = db.relationship('Scores', backref='assref', lazy='dynamic')

    @classmethod
    def add(cls, sinfo):
        newrec = cls(**sinfo)
        db.session.add(newrec)
        db.session.commit()

        return newrec

    @classmethod
    def lookup_sub(cls, subid):
        return cls.query.filter_by(subjid=subid).order_by('date desc').all()


# Scores
class Scores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignid = db.Column(db.Integer, db.ForeignKey('assignments.id'))
    stuid = db.Column(db.Integer, db.ForeignKey('students.id'))
    value = db.Column(db.Integer)

    @classmethod
    def is_empty(cls, assmid):
        return cls.query.filter_by(assignid=assmid).all()

    @classmethod
    def add(cls, sinfo):
        newrec = cls(**sinfo)
        db.session.add(newrec)
        db.session.commit()

    @classmethod
    def update(cls, info):
        rec = cls.query.\
            filter_by(stuid=info['stuid'], assignid=info['assignid']).first()
        rec.value = info['value']
        db.session.commit()
