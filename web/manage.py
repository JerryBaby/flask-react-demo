#!/usr/bin/env python
#


import os
import click
from app import create_app, db
from app.models import User, Role


app = create_app(os.environ.get('FLASK_CONFIG', 'default'))


@app.shell_context_processor
def make_shell_context():
    return dict(db=db)


@app.cli.command()
def hello():
    click.echo('Hi, Jerry!')


if __name__ == '__main__':
    app.run()
