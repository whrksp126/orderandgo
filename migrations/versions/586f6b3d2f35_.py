"""empty message

Revision ID: 586f6b3d2f35
Revises: 7acb111015b8
Create Date: 2023-09-04 21:34:23.149527

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '586f6b3d2f35'
down_revision = '7acb111015b8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('payment_status', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('table_payment_list_id', sa.Integer(), nullable=True))
        batch_op.drop_constraint('payment_ibfk_1', type_='foreignkey')
        batch_op.drop_constraint('payment_ibfk_3', type_='foreignkey')
        batch_op.create_foreign_key(None, 'payment_status', ['payment_status'], ['id'])
        batch_op.create_foreign_key(None, 'table_payment_list', ['table_payment_list_id'], ['id'])
        batch_op.drop_column('store_id')
        batch_op.drop_column('table_order_list_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('table_order_list_id', mysql.INTEGER(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('store_id', mysql.INTEGER(), autoincrement=False, nullable=True))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('payment_ibfk_3', 'store', ['store_id'], ['id'])
        batch_op.create_foreign_key('payment_ibfk_1', 'table_order_list', ['table_order_list_id'], ['id'])
        batch_op.drop_column('table_payment_list_id')
        batch_op.drop_column('payment_status')

    # ### end Alembic commands ###