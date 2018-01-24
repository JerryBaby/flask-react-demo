#-*- coding: utf-8 -*-
import requests
import time
from flask import jsonify
from . import dashboard


@dashboard.route('/get_alerts')
def get_alerts():
    zabbix_api = 'http://localhost:20051/zabbix/api_jsonrpc.php'
    headers = {'Content-Type': 'application/json'}

    def _get_auth_token():
        data = {
            'jsonrpc': '2.0',
            'method': 'user.login',
            'params': {
                'user': 'Admin',
                'password': 'Lvc_zabbixAdmin!'
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

    def _get_trigger_data(token):
        try:
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
                'auth': token,
            }
            r = requests.post(zabbix_api, headers=headers, json=data, timeout=5)
            r.raise_for_status()
            res = r.json().get('result')
        except Exception as e:
            raise e

        return res

    def _get_event_data(token, trigger_data):
        try:
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
                'auth': token,
            }
            r = requests.post(zabbix_api, headers=headers, json=data, timeout=5)
            r.raise_for_status()
            trigger_data['lastEvent'] = r.json().get('result')[0]
        except Exception as e:
            raise

        return trigger_data

    try:
        alerts = []
        token = _get_auth_token()
        trigger_data = _get_trigger_data(token)
        for x in trigger_data:
            x['lastchange'] = time.strftime('%Y-%m-%d %H:%M:%S',
                time.localtime(float(x['lastchange'])))
            res =  _get_event_data(token, x)
            if res['lastEvent']['acknowledged'] == '1':
                res['lastEvent']['acknowledges'][0]['clock'] = \
                    time.strftime('%Y-%m-%d %H:%M:%S',
                        time.localtime(float(res['lastEvent']['acknowledges'][0]['clock'])))
            alerts.append(res)
    except Exception as e:
        return jsonify({'code': 9, 'result': 'get alerts exception.'})

    return jsonify({'code': 0, 'result': alerts})
