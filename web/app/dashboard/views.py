#-*- coding: utf-8 -*-
import requests
import time
from flask import jsonify
from . import dashboard


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

    # 获取 trigger 数据
    def get_trigger_data(self):
        data = {
            'jsonrpc': '2.0',
            'method': 'trigger.get',
            'params': {
                "output": [
                    "description",
                    "lastchange",
                    "priority",
                ],
                "filter": {
                    "value": 1
                },
                'selectLastEvent': ['lastEvent'],
                "expandDescription": 1,
                "min_severity": 0,
                "monitored": 1,
                "only_true": 1,
                "selectHosts": ['host'],
                "skipDependent": 1,
                "sortfield": "lastchange",
                "sortorder": "DESC",
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

        return res

    # 获取 event 数据
    def get_event_data(self, trigger_data):
        data = {
            'jsonrpc': '2.0',
            'method': 'event.get',
            'params': {
                'output': [
                    'acknowledged',
                ],
                'select_acknowledges': [
                    'alias',
                    'message',
                    'surname',
                    'name',
                    'clock',
                ],
                "filter": {
                    "eventid": trigger_data['lastEvent']['eventid'],
                },
            },
            'id': 2,
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
            trigger_data['lastEvent'] = r.json().get('result')[0]
        except Exception as e:
            raise

        return trigger_data


@dashboard.route('/get_alerts')
def get_alerts():
    tencent_api = 'http://localhost:20051/zabbix/api_jsonrpc.php'
    ali_api = 'http://localhost:20051/zabbix/api_jsonrpc.php'
    alerts = []

    try:
        # 获取腾讯平台数据
        za_t = ZabbixApi(tencent_api, 'Admin', 'Admin')
        za_t.login()
        trigger_data_t = za_t.get_trigger_data()
        for x in trigger_data_t:
            x['lastchange'] = time.strftime('%Y-%m-%d %H:%M:%S',
                time.localtime(float(x['lastchange'])))
            res = za_t.get_event_data(x)
            if res['lastEvent']['acknowledged'] == '1':
                res['lastEvent']['acknowledges'][0]['clock'] = \
                    time.strftime('%Y-%m-%d %H:%M:%S',
                        time.localtime(float(res['lastEvent']['acknowledges'][0]['clock'])))
            alerts.append(res)

        # 获取阿里平台数据
        za_a = ZabbixApi(ali_api, 'Admin', 'Admin')
        za_a.login()
        trigger_data_a = za_a.get_trigger_data()
        for x in trigger_data_a:
            x['lastchange'] = time.strftime('%Y-%m-%d %H:%M:%S',
                time.localtime(float(x['lastchange'])))
            res = za_t.get_event_data(x)
            if res['lastEvent']['acknowledged'] == '1':
                res['lastEvent']['acknowledges'][0]['clock'] = \
                    time.strftime('%Y-%m-%d %H:%M:%S',
                        time.localtime(float(res['lastEvent']['acknowledges'][0]['clock'])))
            alerts.append(res)
    except Exception as e:
        return jsonify({'code': 9, 'result': 'get alerts exception.'})

    return jsonify({'code': 0, 'result': alerts})
