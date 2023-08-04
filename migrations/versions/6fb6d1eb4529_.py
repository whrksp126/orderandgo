"""empty message

Revision ID: 6fb6d1eb4529
Revises: 56ac131a4e27
Create Date: 2023-08-04 23:55:41.731321

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '6fb6d1eb4529'
down_revision = '56ac131a4e27'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('order_has_option')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('order_has_option',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('order_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('menu_option_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['menu_option_id'], ['menu_option.id'], name='FK_order_has_option_menu_option'),
    sa.ForeignKeyConstraint(['order_id'], ['order.id'], name='FK_order_has_option_order'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###
