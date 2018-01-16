#!/usr/bin/env python
#-*- coding: utf-8 -*-


from __future__ import absolute_import, unicode_literals
from celery import Celery


celery = Celery('flask-react-demo')
celery.config_from_object('celeries.config')


if __name__ == '__main__':
    celery.start()
