#!/usr/bin/env python
#-*- coding: utf-8 -*-


from __future__ import absolute_import, unicode_literals
import re
import requests
from celery.utils.log import get_task_logger
from .celery import celery
from app import db
from app.data_models import Servers
from manage import app


logger = get_task_logger(__name__)


class ZabbixApi(object):
    def __init__(self, api, user, password):
        self.api = api
        self.user = user
        self.password = password
        self.token = ''
        self.headers = {'Content-Type': 'application/json'}

    # 登录
    def login(self):
        data = {
            'jsonrpc': '2.0',
            'method': 'user.login',
            'params': {
                'user': self.user,
                'password': self.password,
            },
            'id': 0,
        }
        try:
            r = requests.post(
                    self.api,
                    headers=self.headers,
                    json=data,
                    timeout=5,
                    )
            r.raise_for_status()
            self.token = r.json().get('result')
        except Exception as e:
            raise e

    # 获取监控数据
    # 传入主机名后缀, 区分平台
    def get_monitor_data(self, suffix):
        data = {
            'jsonrpc': '2.0',
            'method': 'host.get',
            'params': {
                'output': ['host'],
            },
            'id': 1,
            'auth': self.token,
        }
        try:
            r = requests.post(
                    self.api,
                    headers=self.headers,
                    json=data,
                    timeout=5
                    )
            r.raise_for_status()
            res = r.json().get('result')
        except Exception as e:
            raise e

        # suffix 传入一个list对象, 以支持多个后缀过滤
        suffix = '|'.join(suffix)
        pattern = re.compile(r'^.*(%s)$' % suffix)

        hosts = []
        for i in res:
            if pattern.match(i['host']):
                hosts.append(i['host'])

        return hosts


@celery.task
def update_monitor_status():
    tencent_api = 'http://localhost:20051/zabbix/api_jsonrpc.php'
    ali_api = 'http://localhost:20051/zabbix/api_jsonrpc.php'

    with app.app_context():

        # 更新资产监控信息
        try:
            za_t = ZabbixApi(tencent_api, 'Admin', 'Admin')
            za_t.login()
            hosts_t = za_t.get_monitor_data(['ten\.dm'])

            za_a = ZabbixApi(ali_api, 'Admin', 'Lvc_zabbixAdmin!')
            za_a.login()
            hosts_a = za_a.get_monitor_data(['ali\.dm', 'ali\.qr'])

            hosts_t.extend(hosts_a)

            servers = Servers.query.all()
            for server in servers:
                if server.hostname in hosts_t:
                    server.monitorstatus = True
                    db.session.add(server)
            db.session.commit()
        except Exception as e:
            logger.error(e)
