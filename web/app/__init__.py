from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_login import LoginManager
from config import config


db = SQLAlchemy()
mail = Mail()

login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'


def create_app(environment):
    app = Flask(__name__)
    app.config.from_object(config[environment])

    # init app
    config[environment].init_app(app)
    db.init_app(app)
    mail.init_app(app)
    login_manager.init_app(app)

    # add blueprint
    from main import main as main_blueprint
    from auth import auth as auth_blueprint
    from servers import server as server_blueprint

    app.register_blueprint(main_blueprint)
    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(server_blueprint, url_prefix='/server_api')


    return app


# check the params of APIs
def check_param(r_Keys, e_Keys):
    if set(r_Keys) == set(e_Keys):
        return True
    else:
        return False
