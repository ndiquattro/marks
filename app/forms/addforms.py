from flask.ext.wtf import Form
from wtforms.fields import StringField, DateField, SelectField
from wtforms.validators import DataRequired, Length


class AddYear(Form):
    year = DateField('Start Year', format='%Y', validators=[DataRequired()])
    school = StringField('School Name', validators=[DataRequired(), Length(max=64)])


class AddStudents(Form):
    fname = StringField('First Name', validators=[DataRequired()])
    lname = StringField('Last Name', validators=[DataRequired()])


class AddSubject(Form):
    name = StringField('Subject Name', validators=[DataRequired()])


class AddAssignment(Form):
    name = StringField('Assignment Name')
    date = DateField('Date', format="%m/%d/%y")
    subject = SelectField('Subject')
    scty = SelectField('Score Type', choices=[('pts', 'Points'),
                                              ('cat', 'In or Not')])
