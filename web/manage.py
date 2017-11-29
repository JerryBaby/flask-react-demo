#!/usr/bin/env python
#


import os
import click
from app import create_app, db
from app.user_models import User, userRole
from app.data_models import serveRole, Platform, Attribute, Status, Servers, IPType, IP


app = create_app(os.environ.get('FLASK_CONFIG', 'default'))


@app.shell_context_processor
def make_shell_context():
    return dict(db=db,
                User=User,
                userRole=userRole,
                serveRole=serveRole,
                Platform=Platform,
                Attribute=Attribute,
                Status=Status,
                Servers=Servers,
                IPType=IPType,
                IP=IP)


@app.cli.command()
def hello():
    click.echo('Hi, Jerry!')


if __name__ == '__main__':
    app.run()
