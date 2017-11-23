from flask import render_template
from flask_login import login_required
from . import main


@main.route('/')
@login_required
def index():
    return render_template('main/index.html')


@main.route('/servers')
@login_required
def servers():
    return render_template('main/servers.html')


@main.route('/users')
@login_required
def users():
    return render_template('main/users.html')


@main.route('/cmdb')
@login_required
def cmdb():
    return render_template('main/cmdb.html')
