from app import db
from datetime import datetime

'''
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(120), unique=True)

    def __repr__(self):
        return f'<User {self.username}>'

class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    body = db.Column(db.Text)
    test = db.Column(db.Text)

    def __repr__(self):
        return f'<Post {self.title}>'
    
class Test(db.Model):
    __tablename__ = 'test'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    body = db.Column(db.Text)
    test2 = db.Column(db.Text)

    def __repr__(self):
        return f'<Post {self.title}>'
'''

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(50), unique=True)
    birthday = db.Column(db.Date, nullable=False)
    tel = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True)
    address = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.datetime, default=datetime.now())
    last_logged_at = db.Column(db.datetime, nullable=True)

    def __repr__(self):
        return f'<Post {self.title}>'


class Store(db.Model):
    __tablename__ = 'store'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, foreign_key=('user.id'))
    name = db.Column(db.String(50), unique=True)
    address = db.Column(db.String(150), nullable=False)
    tel = db.Column(db.String(50), nullable=False)
    manager_name = db.Column(db.String(50), nullable=False)
    manager_tel = db.Column(db.String(50), nullable=False)
    logo_img = db.Column(db.String(150), nullable=False)
    store_image = db.Column(db.String(150), nullable=False)
    main_description = db.Column(db.Text, nullable=False)
    sub_description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.datetime, default=datetime.now())
    last_logged_at = db.Column(db.datetime, nullable=True)

    def __repr__(self):
        return f'<Post {self.title}>'


class TableCategory(db.Model):
    __tablename__ = 'table_category'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    store_id = db.Column(db.Integer, foreign_key=('store.id'))
    category_name = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        return f'<Post {self.title}>'


class Table(db.Model):
    __tablename__ = 'table'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=True)
    number = db.Column(db.Integer, nullable=True)
    seat_count = db.Column(db.Integer, nullable=True)
    table_category_id = db.Column(db.Integer, foreign_key=('table_category.id'))

    def __repr__(self):
        return f'<Post {self.title}>'


class MainCategory(db.Model):
    __tablename__ = 'main_category'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    store_id = db.Column(db.Integer, foreign_key=('store.id'))
    name = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Post {self.title}>'


class SubCategory(db.Model):
    __tablename__ = 'sub_category'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    main_category_id = db.Column(db.Integer, foreign_key=('main_category.id'))
    name = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Post {self.title}>'


class MenuHasCategory(db.Model):
    __tablename__ = 'menu_has_category'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    main_category_id = db.Column(db.Integer, foreign_key=('main_category.id'))
    sub_category_id = db.Column(db.Integer, foreign_key=('sub_category.id'), nullable=True)

    def __repr__(self):
        return f'<Post {self.title}>'


class MenuOption(db.Model):
    __tablename__ = 'menu_option'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    store_id = db.Column(db.Integer, foreign_key=('store.id'))

    def __repr__(self):
        return f'<Post {self.title}>'


class Menu(db.Model):
    __tablename__ = 'menu'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(150), nullable=False)
    main_description = db.Column(db.Text, nullable=True)
    sub_description = db.Column(db.Text, nullable=True)
    is_soldout = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.datetime, default=datetime.now())
    store_id = db.Column(db.Integer, foreign_key=('store.id'))
    menu_has_category_id = db.Column(db.Integer, foreign_key=('manu_has_category.id'))
    menu_option_id = db.Column(db.Integer, foreign_key=('manu_option.id'))

    def __repr__(self):
        return f'<Post {self.title}>'


class OrderStatus(db.Model):
    __tablename__ = 'order_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Post {self.title}>'


class Order(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ordered_at = db.Column(db.datetime, default=datetime.now())
    order_status_id = db.Column(db.Integer, foreign_key=('order_status.id'))
    menu_id = db.Column(db.Integer, foreign_key=('menu.id'))
    table_id = db.Column(db.Integer, foreign_key=('table.id'))

    def __repr__(self):
        return f'<Post {self.title}>'


class TableOrderList(db.Model):
    __tablename__ = 'table_order_list'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    table_id = db.Column(db.Integer, foreign_key=('table.id'))
    ordered_id = db.Column(db.Integer, foreign_key=('order.id'))
    checkingin_at = db.Column(db.Datetime, nullable=False)
    checkingout_at = db.Column(db.Datetime, nullable=False)
    order_status_id = db.Column(db.Integer, foreign_key=('order_status.id'))

    def __repr__(self):
        return f'<Post {self.title}>'


class Payment_method(db.Model):
    __tablename__ = 'payment_method'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    method = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Post {self.title}>'


class Payment(db.Model):
    __tablename__ = 'payment'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    payment_amount = db.Column(db.Integer, nullable=False)
    payment_datetime = db.Column(db.Datetime, defalt=datetime.now())
    store_id = db.Column(db.Integer, foreign_key=('store.id'))
    payment_method_id = db.Column(db.Integer, foreign_key=('payment_method.id'))
    table_order_list_id = db.Column(db.Integer, foreign_key=('table_order_list.id'))

    def __repr__(self):
        return f'<Post {self.title}>'