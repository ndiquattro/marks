"""empty message

Revision ID: 614a6d64b3e5
Revises: 7309eaf9b89b
Create Date: 2017-08-18 19:59:36.260582

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '614a6d64b3e5'
down_revision = '7309eaf9b89b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('subscriptions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('stripe_id', sa.String(length=255), nullable=True),
    sa.Column('expiration_date', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_column('users', 'subscribed')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('subscribed', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.drop_table('subscriptions')
    # ### end Alembic commands ###