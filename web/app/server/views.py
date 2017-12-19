#-*- encoding: utf-8 -*-
import socket, struct
from collections import Counter
from flask import request, jsonify
from . import server
from .. import db, check_param
from ..data_models import serveRole, Platform, Attribute, \
        Status, Servers, IPType, IP


@server.route('/get_servers')
def get_servers():
    """
    ->:
    {
        "result": [
            {
                "attribute": "Virtual",
                "hostname": "l-huabei-edge1.lvc.prod.ali.dm",
                "ip": [
                    "47.94.104.252(公网)",
                    "10.107.2.203(内网)"
                ],
                "key": 1,
                "platform": "阿里云",
                "region": "华北2",
                "role": "edge",
                "status": "在线"
            }
        ]
    }
    """
    res = []
    servers = Servers.query.all()
    for s in servers:
        id = s.id
        hostname = s.hostname
        role = s.server_role.rolename
        ips = ['%s (%s)' % (x.address, x.ip_type.ipname) for x in s.ip]
        platform = s.platform.platname
        region = s.platform.regioname
        attribute = s.attribute.attrname
        status = s.server_status.statusname
        res.append({
            'key': id,
            'hostname': hostname,
            'role': role,
            'ip': ips,
            'platform': platform,
            'region': region,
            'attribute': attribute,
            'status': status,
        })
    return jsonify({'code': 0, 'result': res})


@server.route('/server_add', methods=['POST'])
def server_add():
    # 服务器添加和修改应该是原子操作, 一个IP失败, 整个事务都要回滚
    # 独立一个检测函数, 所有检测通过才更新数据库, 都这返回错误信息
    def _collection_check(addresses):
        # 判断表单内部地址是否冲突
        c = Counter(addresses)
        for ip, count in c.iteritems():
            if count > 1 and ip != '':
                return {'code': 6, 'result': 'duplicate IP address %s.' % ip}
        # 判断表单IP地址和数据库中地址是否冲突
        ips = []
        ips_exist = []
        for ip in addresses:
            # 如果IP地址不为空并且引发异常, 说明地址格式错误
            # (可能是直接调用接口而不是通过页面发送的数据)
            if ip != '':
                try:
                    _ip = IP.query.filter_by(address_hash=socket.ntohl(
                        struct.unpack("I",socket.inet_aton(ip))[0])).first()
                except Exception as e:
                    print e
                    return {'code': 7, 'result': 'invalid IP address %s.' % ip}
                if _ip is not None:
                    if _ip.allocated is not None:
                        return {'code': 6, 'result': 'duplicate IP address %s.' % ip}
                    else:
                        ips_exist.append(_ip)
                else:
                    ips.append(ip)
        return {'code': 0, 'ips': ips, 'ips_exist': ips_exist}


    data = request.json
    if data is not None and \
            check_param(data.keys(), [
                'attribute',
                'lanIp',
                'platform',
                'role',
                'serverName',
                'status',
                'virtualIp',
                'wanIp',
            ]):
        # 判断是否主机名冲突
        server = Servers.query.filter_by(hostname=data['serverName']).first()
        if server is not None:
            return jsonify({'code': 5, 'result': 'duplicate host name.'})

        # 服务器信息
        server = Servers(hostname=data['serverName'])
        server.role_id = serveRole.query.filter_by(rolename=data['role']).first().id
        server.plat_id = Platform.query.filter_by(platname=data['platform'][0],regioname=data['platform'][1]).first().id
        server.attr_id = Attribute.query.filter_by(attrname=data['attribute']).first().id
        server.servicestatus = Status.query.filter_by(statusname=data['status']).first().id

        # 获取表单IP地址
        form_address = data['lanIp'].split(',') + \
                       data['wanIp'].split(',') + \
                       data['virtualIp'].split(',')

        ips = []
        # 检测IP地址是否冲突
        check_res = _collection_check(form_address)
        if check_res['code'] == 0:

            for ip in check_res['ips']:
                _ip = IP(address=ip)
                _ip.server = server
                if ip in data['lanIp'].split(','):
                    _ip.type_id = IPType.query.filter_by(ipname=u'内网').first().id
                if ip in data['wanIp'].split(','):
                    _ip.type_id = IPType.query.filter_by(ipname=u'公网').first().id
                if ip in data['virtualIp'].split(','):
                    _ip.type_id = IPType.query.filter_by(ipname=u'VIP').first().id
                ips.append(_ip)

            for ip in check_res['ips_exist']:
                ip.server = server
                if ip.address in data['lanIp'].split(','):
                    ip.type_id = IPType.query.filter_by(ipname=u'内网').first().id
                if ip.address in data['wanIp'].split(','):
                    ip.type_id = IPType.query.filter_by(ipname=u'公网').first().id
                if ip.address in data['virtualIp'].split(','):
                    ip.type_id = IPType.query.filter_by(ipname=u'VIP').first().id
                ips.append(ip)
        else:
            return jsonify(check_res)

        try:
            db.session.add(server)
            db.session.add_all(ips)
            db.session.commit()
            # 返回新增加的服务器信息
            id = server.id
            hostname = server.hostname
            role = server.server_role.rolename
            ips = ['%s (%s)' % (x.address, x.ip_type.ipname) for x in server.ip]
            platform = server.platform.platname
            region = server.platform.regioname
            attribute = server.attribute.attrname
            status = server.server_status.statusname
            res = {
                'key': id,
                'hostname': hostname,
                'role': role,
                'ip': ips,
                'platform': platform,
                'region': region,
                'attribute': attribute,
                'status': status,
            }
            return jsonify({'code': 0, 'result': res})
        except Exception as e:
            print e
            return jsonify({'code': 8, 'result': 'database session exception.'})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@server.route('/server_del', methods=['POST'])
def server_del():
    data = request.json
    if data is not None and \
            check_param(data.keys(), ['id']):
        server = Servers.query.filter_by(id=data['id']).first()
        if server is not None:
            ips = server.ip
            try:
                for ip in ips:
                    db.session.delete(ip)
                db.session.delete(server)
                db.session.commit()
                return jsonify({'code': 0, 'result': 'delete server ok.'})
            except Exception as e:
                print e
                return jsonify({'code': 8, 'result': 'database session exception.'})
        else:
            return jsonify({'code': 4, 'result': 'no data.'})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@server.route('/server_modify', methods=['POST'])
def server_modify():
    # IP地址信息有三种情况:
    # 1. 删除了IP地址
    # 2. 增加了IP地址
    # 3. IP地址属性发生了变化
    def _collection_check(addresses):
        # 判断表单内部地址是否冲突
        c = Counter(addresses)
        for ip, count in c.iteritems():
            if count > 1 and ip != '':
                return {'code': 6, 'result': 'duplicate IP address %s.' % ip}
        # 判断表单IP地址是否和数据库中分配对象不是此server的地址冲突
        ips = []
        ips_exist = []
        for ip in addresses:
            # 如果IP地址不为空并且引发异常, 说明地址格式错误
            # (可能是直接调用接口而不是通过页面发送的数据)
            if ip != '':
                try:
                    _ip = IP.query.filter_by(address_hash=socket.ntohl(
                        struct.unpack("I",socket.inet_aton(ip))[0])).first()
                except Exception as e:
                    print e
                    return {'code': 7, 'result': 'invalid IP address %s.' % ip}
                if _ip is not None:
                    if _ip.allocated is not None and _ip.allocated != data['key']:
                        return {'code': 6, 'result': 'existing address %s' % ip}
                    else:
                        ips_exist.append(_ip)
                else:
                    ips.append(ip)
        return {'code': 0, 'ips': ips, 'ips_exist': ips_exist}

    # 解除绑定的IP地址
    # 如果原本已绑定的IP地址没变化则不解绑
    def _release_ip(server, exist):
        for ip in server.ip:
            if ip is not None and ip not in exist:
                db.session.delete(ip)
        db.session.commit()


    data = request.json
    if data is not None and \
            check_param(data.keys(), [
                'attribute',
                'key',
                'lanIp',
                'platform',
                'role',
                'serverName',
                'status',
                'virtualIp',
                'wanIp',
            ]):
        server = Servers.query.filter_by(id=data['key']).first()
        # id没有对应的服务器
        # (可能是直接调用接口而不是通过页面发送的数据)
        if server is None:
            return jsonify({'code': 4, 'result': 'no data.'})

        # 判断是否主机名冲突
        if server.hostname != data['serverName']:
            if Servers.query.filter_by(hostname=data['serverName']).first():
                return jsonify({'code': 5, 'result': 'duplicate host name.'})

        # 获取表单IP地址
        form_address = data['lanIp'].split(',') + \
                       data['wanIp'].split(',') + \
                       data['virtualIp'].split(',')

        ips = []
        # 检测IP地址是否冲突
        check_res = _collection_check(form_address)
        if check_res['code'] == 0:
            # 解除绑定IP
            _release_ip(server, check_res['ips_exist'])

            # 更新服务器信息
            server.hostname = data['serverName']
            server.role_id = serveRole.query.filter_by(rolename=data['role']).first().id
            server.plat_id = Platform.query.filter_by(platname=data['platform'][0],regioname=data['platform'][1]).first().id
            server.attr_id = Attribute.query.filter_by(attrname=data['attribute']).first().id
            server.servicestatus = Status.query.filter_by(statusname=data['status']).first().id

            for ip in check_res['ips']:
                _ip = IP(address=ip)
                _ip.server = server
                if ip in data['lanIp'].split(','):
                    _ip.type_id = IPType.query.filter_by(ipname=u'内网').first().id
                if ip in data['wanIp'].split(','):
                    _ip.type_id = IPType.query.filter_by(ipname=u'公网').first().id
                if ip in data['virtualIp'].split(','):
                    _ip.type_id = IPType.query.filter_by(ipname=u'VIP').first().id
                ips.append(_ip)

            for ip in check_res['ips_exist']:
                ip.server = server
                if ip.address in data['lanIp'].split(','):
                    ip.type_id = IPType.query.filter_by(ipname=u'内网').first().id
                if ip.address in data['wanIp'].split(','):
                    ip.type_id = IPType.query.filter_by(ipname=u'公网').first().id
                if ip.address in data['virtualIp'].split(','):
                    ip.type_id = IPType.query.filter_by(ipname=u'VIP').first().id
                ips.append(ip)
        else:
            return jsonify(check_res)

        try:
            db.session.add(server)
            db.session.add_all(ips)
            db.session.commit()
            # 返回更新后的服务器信息
            id = server.id
            hostname = server.hostname
            role = server.server_role.rolename
            ips = ['%s (%s)' % (x.address, x.ip_type.ipname) for x in server.ip]
            platform = server.platform.platname
            region = server.platform.regioname
            attribute = server.attribute.attrname
            status = server.server_status.statusname
            res = {
                'key': id,
                'hostname': hostname,
                'role': role,
                'ip': ips,
                'platform': platform,
                'region': region,
                'attribute': attribute,
                'status': status,
            }
            return jsonify({'code': 0, 'result': res})
        except Exception as e:
            print e
            return jsonify({'code': 8, 'result': 'database session exception.'})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


@server.route('/get_roles')
def get_roles():
    '''
    ->
    {
        "result": [
            {
                "key": 1,
                "role": "edge"
            },
            {
                "key": 2,
                "role": "relay"
            },
            {
                "key": 3,
                "role": "gslb"
            }
        ]
    }
    '''
    res = []
    roles = serveRole.query.all()
    for r in roles:
        id = r.id
        role = r.rolename
        res.append({
            'key': id,
            'role': role,
        })
    return jsonify({'code': 0, 'result': res})
#role add
#role del
#role modify


@server.route('/get_platforms')
def get_platforms():
    '''
    {
        "result": [
            {
                "key": 1,
                "platform": "阿里云",
                "region": [
                    "华北2",
                    "新加坡"
                ]
            },
            {
                "key": 2,
                "platform": "腾讯云",
                "region": [
                    "华北1",
                    "华北2"
                ]
            }
        ]
    }
    '''
    res = []
    prs = {}
    platforms = Platform.query.all()
    for p in platforms:
        platform = p.platname
        region = p.regioname
        if prs.has_key(platform):
            # 理论上同一个云平台下不能出现相同的区域
            # 增加一层判断避免遗漏
            if region not in prs[platform]:
                prs[platform].append(region)
        else:
            prs[platform] = [region]

    i = 1
    for p, r in prs.iteritems():
        res.append({
            "key": i,
            "platform": p,
            "region": r,
        })
        i += 1
    return jsonify({'code': 0, 'result': res})
#platform add
#platform del
#platform modify


# 服务器状态和服务器属性接口暂时不对外开放
# @server.route('/get_status')
# def get_status():
    # '''
    # ->
    # {
        # "result": [
            # {
                # "key": 1,
                # "status": "在线"
            # },
            # {
                # "key": 2,
                # "status": "下线"
            # }
        # ]
    # }
    # '''
    # res = []
    # status = Status.query.all()
    # for s in status:
        # id = s.id
        # status = s.statusname
        # res.append({
            # 'key': id,
            # 'status': status,
        # })
    # return jsonify({'code': 0, 'result': res})
