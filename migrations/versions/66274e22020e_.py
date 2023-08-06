"""empty message

Revision ID: 66274e22020e
Revises: df8922506eb4
Create Date: 2023-08-05 11:59:51.153774

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '66274e22020e'
down_revision = 'df8922506eb4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('main_category', schema=None) as batch_op:
        batch_op.add_column(sa.Column('page', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('position', sa.Integer(), nullable=True))

    with op.batch_alter_table('table_category', schema=None) as batch_op:
        batch_op.add_column(sa.Column('page', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('position', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('table_category', schema=None) as batch_op:
        batch_op.drop_column('position')
        batch_op.drop_column('page')

    with op.batch_alter_table('main_category', schema=None) as batch_op:
        batch_op.drop_column('position')
        batch_op.drop_column('page')

    # ### end Alembic commands ###