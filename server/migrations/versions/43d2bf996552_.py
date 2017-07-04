"""empty message

Revision ID: 43d2bf996552
Revises: a9149557b5cd
Create Date: 2017-06-30 23:48:51.703598

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '43d2bf996552'
down_revision = 'a9149557b5cd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('active_year', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'active_year')
    # ### end Alembic commands ###
