#-*- encoding: utf-8 -*-
import socket, struct
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
        server = Servers.query.filter_by(hostname=data['serverName']).first()
        if server is not None:
            return jsonify({'code': 5, 'result': 'duplicate host name.'})
        else:
            lanIps = []
            for l in data['lanIp'].split(','):
                try:
                    ip = IP.query.filter_by(address_hash=socket.ntohl(
                        struct.unpack("I",socket.inet_aton(l))[0])).first()
                except:
                    ip = None
                lanIps.append(ip)
            wanIps = []
            for w in data['wanIp'].split(','):
                try:
                    ip = IP.query.filter_by(address_hash=socket.ntohl(
                        struct.unpack("I",socket.inet_aton(w))[0])).first()
                except:
                    ip = None
                wanIps.append(ip)
            virtualIps = []
            for v in data['virtualIp'].split():
                try:
                    ip = IP.query.filter_by(address_hash=socket.ntohl(
                        struct.unpack("I",socket.inet_aton(v))[0])).first()
                except:
                    ip = None
                virtualIps.append(ip)

            for ip in lanIps+wanIps+virtualIps:
                if ip is not None:
                    return jsonify({'code': 6, 'result': 'existing address %s' % ip})

            server = Servers(hostname=data['serverName'])
            server.server_role = serveRole.query.filter_by(rolename=data['role']).first()
            server.platform = Platform.query.filter_by(platname=data['platform'][0],regioname=data['platform'][1]).first()
            server.attribute = Attribute.query.filter_by(attrname=data['attribute']).first()
            server.server_status = Status.query.filter_by(statusname=data['status']).first()

            l_IPs = []
            w_IPs = []
            v_IPs = []
            for l in data['lanIp'].split(','):
                if l != '':
                    try:
                        ip = IP(address=l)
                        ip.ip_type = IPType.query.filter_by(ipname=u'内网').first()
                        ip.server = server
                        l_IPs.append(ip)
                    except:
                        return jsonify({'code': 7, 'result': 'invalid IP address.'})
            for w in data['wanIp'].split(','):
                if w != '':
                    try:
                        ip = IP(address=w)
                        ip.ip_type = IPType.query.filter_by(ipname=u'公网').first()
                        ip.server = server
                        w_IPs.append(ip)
                    except:
                        return jsonify({'code': 7, 'result': 'invalid IP address.'})
            for v in data['virtualIp'].split(','):
                if v != '':
                    try:
                        ip = IP(address=v)
                        ip.ip_type = IPType.query.filter_by(ipname=u'VIP').first()
                        ip.server = server
                        v_IPs.append(ip)
                    except:
                        return jsonify({'code': 7, 'result': 'invalid IP address.'})

            try:
                db.session.add(server)
                db.session.add_all(l_IPs+w_IPs+v_IPs)
                db.session.commit()
                # return new server
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
            except:
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
            except:
                return jsonify({'code': 8, 'result': 'database session exception.'})
        else:
            return jsonify({'code': 4, 'result': 'no data.'})
    else:
        return jsonify({'code': 1, 'result': 'invalid parameters.'})


#server modify


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
            # 理论上同一个云平台下不能出现想通的区域
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
