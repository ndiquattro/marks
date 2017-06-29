import os

# Database set-up
basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, '../app2.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Forms setup
WTF_CSRF_ENABLED = True
SECRET_KEY = 'a7j4b4zZKRRiNEPNFFCe'
