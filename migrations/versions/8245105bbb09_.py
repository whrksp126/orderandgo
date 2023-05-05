"""empty message

Revision ID: 8245105bbb09
Revises: 
Create Date: 2023-05-05 23:00:41.363803

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '8245105bbb09'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('test2', schema=None) as batch_op:
        batch_op.add_column(sa.Column('test2', sa.Text(), nullable=True))
        batch_op.drop_column('test')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('test2', schema=None) as batch_op:
        batch_op.add_column(sa.Column('test', mysql.TEXT(), nullable=True))
        batch_op.drop_column('test2')

    # ### end Alembic commands ###
