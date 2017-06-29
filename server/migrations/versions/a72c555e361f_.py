"""empty message

Revision ID: a72c555e361f
Revises: 
Create Date: 2017-06-28 17:40:04.158387

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a72c555e361f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('salutation', sa.String(length=4), nullable=True),
    sa.Column('first_name', sa.String(length=255), nullable=True),
    sa.Column('last_name', sa.String(length=255), nullable=True),
    sa.Column('subscribed', sa.Boolean(), nullable=True),
    sa.Column('created', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('years',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('school', sa.String(length=255), nullable=True),
    sa.Column('first_day', sa.DateTime(), nullable=True),
    sa.Column('last_day', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('students',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=255), nullable=True),
    sa.Column('last_name', sa.String(length=255), nullable=True),
    sa.Column('unique', sa.Integer(), nullable=True),
    sa.Column('year_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['year_id'], ['years.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('subjects',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('year_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['year_id'], ['years.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('assignments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.Column('type', sa.String(length=255), nullable=True),
    sa.Column('max', sa.Integer(), nullable=True),
    sa.Column('subject_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['subject_id'], ['subjects.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('scores',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('value', sa.Integer(), nullable=True),
    sa.Column('assignment_id', sa.Integer(), nullable=True),
    sa.Column('student_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['assignment_id'], ['assignments.id'], ),
    sa.ForeignKeyConstraint(['student_id'], ['students.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('scores')
    op.drop_table('assignments')
    op.drop_table('subjects')
    op.drop_table('students')
    op.drop_table('years')
    op.drop_table('users')
    # ### end Alembic commands ###