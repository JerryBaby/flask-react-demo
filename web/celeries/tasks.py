#!/usr/bin/env python
#-*- coding: utf-8 -*-


from __future__ import absolute_import, unicode_literals
import requests
from celery.utils.log import get_task_logger
from .celery import celery
from app import db
from app.data_models import Servers
from manage import app


logger = get_task_logger(__name__)


@celery.task
def update_monitor_status():
    with app.app_context():
        zabbix_api = 'http://localhost/zabbix/api_jsonrpc.php'
        headers = {'Content-Type': 'application/json'}

        # 获取认证 token
        def _get_auth_token():
            data = {
                'jsonrpc': '2.0',
                'method': 'user.login',
                'params': {
                    'user': 'Admin',
                    'password': 'Admin'
                },
                'id': 0,
            }
            try:
                r = requests.post(zabbix_api, headers=headers, json=data, timeout=5)
                r.raise_for_status()
                token = r.json().get('result')
            except Exception as e:
                raise e

            return token

        # 获取监控数据
        def _get_monitor_data():
            try:
                token = _get_auth_token()
                data = {
                    'jsonrpc': '2.0',
                    'method': 'host.get',
                    'params': {
                        'output': ['host'],
                    },
                    'id': 1,
                    'auth': token
                }
                r = requests.post(zabbix_api, headers=headers, json=data, timeout=5)
                r.raise_for_status()
                res = r.json().get('result')
            except Exception as e:
                raise e

            hosts = []
            for i in res:
                hosts.append(i['host'])

            return hosts

        # 更新资产监控信息
        try:
            hosts = _get_monitor_data()
            servers = Servers.query.all()
            for server in servers:
                if server.hostname in hosts:
                    server.monitorstatus = True
                    db.session.add(server)
            db.session.commit()
        except Exception as e:
            logger.error(e)
