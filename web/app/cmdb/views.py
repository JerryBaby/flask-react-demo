#-*- coding: utf-8 -*-
import Queue
import threading
from flask import request, jsonify
import requests
from . import cmdb


API_VK1 = 'http://localhost/api/invoker/service/test/changeDBtoVK/class/{classID}?operatorId=666666'
API_VK2 = 'http://localhost/api/invoker/service/class/{classID}/newLine/S9_V1_L2?operatorId=666666&operatorType=Staff'
API_DB2 = 'http://localhost/api/invoker/service/class/{classID}/newLine/S4_V0_L2?operatorId=666666&operatorType=Staff'
API_SW1 = 'http://localhost/api/invoker/service/test/changeDBtoVK/class/{classID}?operatorId=666666&vendor=3'


class SwitchLineThread(threading.Thread):
    def __init__(self, semaphore, apis, succ, fail, queue):
        super(SwitchLineThread, self).__init__()
        self.semaphore = semaphore
        self.apis = apis
        self.succ = succ
        self.fail = fail
        self._q = queue
        self.daemon = True

    def run(self):
        self.semaphore.acquire()
        while True:
            if len(self.apis) == 1:
                classid = self._q.get()
                if classid.isdigit():
                    url = self.apis[0].format(classID=classid)
                    try:
                        r = requests.put(url, timeout=10)
                        r.raise_for_status()
                        if r.json().get('success'):
                            self.succ.append(classid)
                            print 'Success: %s' % classid
                        else:
                            self.fail.append(classid)
                            print 'Failed: %s' % classid
                    except Exception as e:
                        print e
                        self.fail.append(classid)
                        print 'Failed: %s' % classid
                else:
                    self.fail.append(classid)
                    print 'Failed: %s' % classid
                self._q.task_done()

            if len(self.apis) == 2:
                classid = self._q.get()
                if classid.isdigit():
                    url_1 = self.apis[0].format(classID=classid)
                    url_2 = self.apis[1].format(classID=classid)
                    try:
                        r1 = requests.put(url_1, timeout=5)
                        r1.raise_for_status()
                        if r1.json().get('success'):
                            r2 = requests.put(url_2, timeout=5)
                            r2.raise_for_status()
                            if r2.json().get('success'):
                                self.succ.append(classid)
                                print 'Success: %s' % classid
                            else:
                                self.fail.append(classid)
                                print 'Failed: %s' % classid
                        else:
                            self.fail.append(classid)
                            print 'Failed: %s' % classid
                    except Exception as e:
                        print e
                        self.fail.append(classid)
                        print 'Failed: %s' % classid
                else:
                    self.fail.append(classid)
                    print 'Failed: %s' % classid
                self._q.task_done()
        self.semaphore.release()


@cmdb.route('/switch_vk1', methods=['POST'])
def switch_vk1():
    semaphore = threading.Semaphore(8)
    succ = []
    fail = []
    queue = Queue.Queue()
    data = request.json
    if data is not None and data.get('classid'):
        for id in data['classid'].split('\n'):
            queue.put(id)
        for _ in range(16):
            t = SwitchLineThread(semaphore, [API_VK1], succ, fail, queue)
            t.start()
        queue.join()
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@cmdb.route('/switch_vk2', methods=['POST'])
def switch_vk2():
    semaphore = threading.Semaphore(8)
    succ = []
    fail = []
    queue = Queue.Queue()
    data = request.json
    if data is not None and data.get('classid'):
        for id in data['classid'].split('\n'):
            queue.put(id)
        for _ in range(16):
            t = SwitchLineThread(semaphore, [API_VK1, API_VK2], succ, fail, queue)
            t.start()
        queue.join()
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@cmdb.route('/switch_sw1', methods=['POST'])
def switch_sw1():
    semaphore = threading.Semaphore(8)
    succ = []
    fail = []
    queue = Queue.Queue()
    data = request.json
    if data is not None and data.get('classid'):
        for id in data['classid'].split('\n'):
            queue.put(id)
        for _ in range(16):
            t = SwitchLineThread(semaphore, [API_SW1], succ, fail, queue)
            t.start()
        queue.join()
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@cmdb.route('/switch_db2', methods=['POST'])
def switch_db2():
    semaphore = threading.Semaphore(8)
    succ = []
    fail = []
    queue = Queue.Queue()
    data = request.json
    if data is not None and data.get('classid'):
        for id in data['classid'].split('\n'):
            queue.put(id)
        for _ in range(16):
            t = SwitchLineThread(semaphore, [API_DB2], succ, fail, queue)
            t.start()
        queue.join()
        return jsonify({'code': 0, 'result': {'success': succ, 'failed': fail}})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})
