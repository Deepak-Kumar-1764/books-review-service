from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.models import db
from flask_migrate import Migrate
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from flask_cors import CORS
from flasgger import Swagger
import redis


migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)
    swagger = Swagger(app)
    app.redis_client = redis.StrictRedis(host='localhost', port=5000, db=0, decode_responses=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)
    migrate.init_app(app, db)

    from app import models

    from app.routes.books import books_bp
    from app.routes.reviews import reviews_bp
    app.register_blueprint(books_bp)
    app.register_blueprint(reviews_bp)

    @app.route("/")
    def home():
        return "📚 Book Review API is running"

    return app
