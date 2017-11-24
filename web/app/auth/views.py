from flask import render_template, redirect, request, url_for, jsonify
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import auth
from .. import db, check_param
from ..user_models import User
from ..email import send_email


@auth.before_app_request
def before_request():
    if current_user.is_authenticated \
            and not current_user.confirmed \
            and request.endpoint \
            and request.endpoint[:5] != 'auth.' \
            and request.endpoint != 'static':
        return redirect(url_for('auth.unconfirmed'))


@auth.route('/unconfirmed')
def unconfirmed():
    if current_user.is_anonymous or current_user.confirmed:
        return redirect(url_for('main.index'))
    return render_template('auth/unconfirmed.html')


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('auth/login.html')
    if request.method == 'POST':
        data = request.json
        if data is not None and \
                check_param(data.keys(), ['userName', 'password', 'remember']):
            user = User.query.filter_by(username=data['userName']).first()
            if user is not None:
                if user.verify_password(data['password']):
                    if data['remember']:
                        login_user(user, remember=True)
                    else:
                        login_user(user)
                    return jsonify({'code': 0, 'result': ''})
                else:
                    return jsonify({'code': 3, 'result': 'incorrect password.'})
            else:
                return jsonify({'code': 2, 'result': 'user not registered.'})
        else:
            return jsonify({'code': 1, 'result': 'invalid request parameters.'})


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))


@auth.route('/register', methods=['GET', 'POST'])
def register():
    return render_template('auth/register.html')


@auth.route('/confirm/<token>')
@login_required
def confirm(token):
    pass


@auth.route('/confirm')
@login_required
def resend_confirmation():
    pass
