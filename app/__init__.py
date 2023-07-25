from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from sqlalchemy.ext.declarative import declarative_base
from contextlib import contextmanager
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, text

db = SQLAlchemy()
migrate = Migrate()     

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    
    # 모든 모델 클래스들을 한번에 import
    from app import models
    
    with app.app_context():
        db.create_all()    
        
    from app.routes.main import main_bp
    from app.routes.auth import auth_bp
    from app.routes.pos import pos_bp
    from app.routes.adm import adm_bp
    from app.routes.order import order_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(pos_bp)
    app.register_blueprint(adm_bp)
    app.register_blueprint(order_bp)
    
    return app
