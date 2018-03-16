#-*- coding: utf-8 -*-
from flask import request, jsonify
import requests
from . import cmdb


API_VK1 = 'http://localhost/api/invoker/service/test/changeDBtoVK/class/{classId}?operatorId=666666'
API_VK2 = 'http://localhost/api/invoker/service/class/{classId}/newLine/S9_V1_L2?operatorId=666666&operatorType=Staff'
API_DB2 = 'http://localhost/api/invoker/service/class/{classId}/newLine/S4_V0_L2?operatorId=666666&operatorType=Staff'


@cmdb.route('/switch_vk1', methods=['POST'])
def switch_vk1():
    succ = []
    fail = []
    data = request.json
    if data is not None and data.get('classid'):
        for i in data['classid'].split('\n'):
            if i.isdigit():
                url = API_VK1.format(classId=i)
                try:
                    r = requests.put(url, timeout=10)
                    r.raise_for_status()
                    if not r.json().get('success'):
                        print 'failed: %s' % i
                        fail.append(i)
                    else:
                        print 'success: %s' % i
                        succ.append(i)
                except Exception as e:
                    print e
                    print 'failed: %s' % i
                    fail.append(i)
            else:
                print 'failed: %s' % i
                fail.append(i)
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@cmdb.route('/switch_vk2', methods=['POST'])
def switch_vk2():
    succ = []
    fail = []
    data = request.json
    if data is not None and data.get('classid'):
        for i in data['classid'].split('\n'):
            if i.isdigit():
                url_1 = API_VK1.format(classId=i)
                url_2 = API_VK2.format(classId=i)
                try:
                    r1 = requests.put(url_1, timeout=5)
                    r1.raise_for_status()
                    if r1.json().get('success'):
                        r2 = requests.put(url_2, timeout=5)
                        r2.raise_for_status()
                        if r2.json().get('success'):
                            succ.append(i)
                        else:
                            fail.append(i)
                    else:
                        fail.append(i)
                except Exception as e:
                    print e
                    fail.append(i)
            else:
                fail.append(i)
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@cmdb.route('/switch_db2', methods=['POST'])
def switch_db2():
    succ = []
    fail = []
    data = request.json
    if data is not None and data.get('classid'):
        for i in data['classid'].split('\n'):
            if i.isdigit():
                url = API_DB2.format(classId=i)
                try:
                    r = requests.put(url, timeout=10)
                    r.raise_for_status()
                    if not r.json().get('success'):
                        fail.append(i)
                    else:
                        succ.append(i)
                except Exception as e:
                    print e
                    fail.append(i)
            else:
                fail.append(i)
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})
