from app import db


class CRUDMixin(object):
    id = db.Column(db.Integer, primary_key=True)

    @classmethod
    def get(cls, id):
        return cls.query.get(id)

    @classmethod
    def get_byyear(cls, yid):
        return cls.query.filter_by(yearid=yid).all()
