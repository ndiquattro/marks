from . import db


# Year Table
class Years(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school = db.Column(db.String(64), index=True, unique=False)
    year = db.Column(db.Integer, index=True, unique=False)
    student = db.relationship('Students', backref='year', lazy='dynamic')

    def __repr__(self):
        return '<User %r>' % self.firstname


# Students Table
class Students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    yearid = db.Column(db.Integer, db.ForeignKey('years.id'))
    first_name = db.Column(db.String(64), index=True, unique=False)
    last_name = db.Column(db.String(64), index=True, unique=False)
