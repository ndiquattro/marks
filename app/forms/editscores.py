from flask.ext.wtf import Form
from wtforms.fields import IntegerField, FieldList, FormField, HiddenField
from wtforms.validators import DataRequired


class ScoreForm(Form):
    firstname = HiddenField()
    stuid = HiddenField()
    score = IntegerField()


class EditScores(Form):
    scores = FieldList(FormField(ScoreForm))
