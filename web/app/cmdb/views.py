#-*- coding: utf-8 -*-
import threading
from flask import request, jsonify
import requests
from . import cmdb


API_VK1 = 'http://localhost/api/invoker/service/test/changeDBtoVK/class/{classID}?operatorId=666666'
API_VK2 = 'http://localhost/api/invoker/service/class/{classID}/newLine/S9_V1_L2?operatorId=666666&operatorType=Staff'
API_DB2 = 'http://localhost/api/invoker/service/class/{classID}/newLine/S4_V0_L2?operatorId=666666&operatorType=Staff'


class SwitchLineThread(threading.Thread):
    def __init__(self, semaphore, apis, classid, succ, fail):
        super(SwitchLineThread, self).__init__()
        self.semaphore = semaphore
        self.apis = apis
        self.classid = classid
        self.succ = succ
        self.fail = fail

    def run(self):
        if len(self.apis) == 1:
            self.semaphore.acquire()
            if self.classid.isdigit():
                url = self.apis[0].format(classID=self.classid)
                try:
                    r = requests.put(url, timeout=10)
                    r.raise_for_status()
                    if r.json().get('success'):
                        self.succ.append(self.classid)
                    else:
                        fail.append(self.classid)
                except Exception as e:
                    print e
                    fail.append(self.classid)
            else:
                self.fail.append(self.classid)
            self.semaphore.release()

        if len(self.apis) == 2:
            self.semaphore.acquire()
            if self.classid.isdigit():
                url_1 = self.apis[0].format(classID=self.classid)
                url_2 = self.apis[1].format(classID=self.classid)
                try:
                    r1 = requests.put(url_1, timeout=5)
                    r1.raise_for_status()
                    if r1.json().get('success'):
                        r2 = requests.put(url_2, timeout=5)
                        r2.raise_for_status()
                        if r2.json().get('success'):
                            self.succ.append(self.classid)
                        else:
                            fail.append(self.classid)
                    else:
                        fail.append(self.classid)
                except Exception as e:
                    print e
                    fail.append(self.classid)
            else:
                self.fail.append(self.classid)
            self.semaphore.release()


@cmdb.route('/switch_vk1', methods=['POST'])
def switch_vk1():
    succ = []
    fail = []
    data = request.json
    if data is not None and data.get('classid'):
        semaphore = threading.Semaphore(10)
        for id in data['classid'].split('\n'):
            t = SwitchLineThread(semaphore, [API_VK1], id, succ, fail)
            t.start()
            t.join()
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@cmdb.route('/switch_vk2', methods=['POST'])
def switch_vk2():
    succ = []
    fail = []
    data = request.json
    if data is not None and data.get('classid'):
        semaphore = threading.Semaphore(10)
        for id in data['classid'].split('\n'):
            t = SwitchLineThread(semaphore, [API_VK1, API_VK2], id, succ, fail)
            t.start()
            t.join()
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@cmdb.route('/switch_db2', methods=['POST'])
def switch_db2():
    succ = []
    fail = []
    data = request.json
    if data is not None and data.get('classid'):
        semaphore = threading.Semaphore(10)
        for id in data['classid'].split('\n'):
            t = SwitchLineThread(semaphore, [API_DB2], id, succ, fail)
            t.start()
            t.join()
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})
