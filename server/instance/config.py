import os
from datetime import timedelta

# Database set-up
basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, '../app3.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Forms setup
WTF_CSRF_ENABLED = True
SECRET_KEY = 'a7j4b4zZKRRiNEPNFFCe'

# JWT Setup
JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

# Flask-Security Configs
SECURITY_RECOVERABLE = True
SECURITY_CHANGEABLE = True
SECURITY_TRACKABLE = True
SECURITY_CONFIRMABLE = True
SECURITY_PASSWORD_HASH = "plaintext"
SECURITY_PASSWORD_SALT = "Rock"

SECURITY_SEND_PASSWORD_CHANGE_EMAIL = False
# Flask-Mail Configs
# MAIL_DEFAULT_SENDER = ('Marks', 'marks@marks.com')
# MAIL_SERVER = 'smtp.sendgrid.net'
# MAIL_PORT = 465
# MAIL_USE_SSL = True
# MAIL_USERNAME = 'apikey'
# MAIL_PASSWORD = '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'
