#-*- encoding: utf-8 -*-
import socket, struct
from flask import request, jsonify
from . import server
from .. import check_param
from ..data_models import serveRole, Platform, Status, \
    Servers, IPType, IP


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

#server add
#server del
#server modify
@server.route('/search', methods=['POST'])
def search():
    res = []
    data = request.json
    if data is not None and \
            check_param(data.keys(), ['hostname', 'ip']):
        server = Servers.query.filter_by(hostname=data['hostname']).first()
        try:
            ip = IP.query.filter_by(address_hash=socket.ntohl(
                struct.unpack("I",socket.inet_aton(data['ip']))[0])).first()
        except:
            ip = None

        if ip is not None:
            if server != ip.server:
                if server is not None:
                    id = server.id
                    iid = ip.server.id
                    hostname = server.hostname
                    ihostname = ip.server.hostname
                    role = server.server_role.rolename
                    irole = ip.server.server_role.rolename
                    ips = ['%s (%s)' % (x.address, x.ip_type.ipname) for x in server.ip]
                    iips = ['%s (%s)' % (x.address, x.ip_type.ipname) for x in ip.server.ip]
                    platform = server.platform.platname
                    iplatform = ip.server.platform.platname
                    region = server.platform.regioname
                    iregion = ip.server.platform.regioname
                    attribute = server.attribute.attrname
                    iattribute = ip.server.attribute.attrname
                    status = server.server_status.statusname
                    istatus = ip.server.server_status.statusname
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
                    res.append({
                        'key': iid,
                        'hostname': ihostname,
                        'role': irole,
                        'ip': iips,
                        'platform': iplatform,
                        'region': iregion,
                        'attribute': iattribute,
                        'status': istatus,
                    })
                    return jsonify({'code': 0, 'result': res})

            id = ip.server.id
            hostname = ip.server.hostname
            role = ip.server.server_role.rolename
            ips = ['%s (%s)' % (x.address, x.ip_type.ipname) for x in ip.server.ip]
            platform = ip.server.platform.platname
            region = ip.server.platform.regioname
            attribute = ip.server.attribute.attrname
            status = ip.server.server_status.statusname
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

        if server is not None:
            id = server.id
            hostname = server.hostname
            role = server.server_role.rolename
            ips = ['%s (%s)' % (x.address, x.ip_type.ipname) for x in server.ip]
            platform = server.platform.platname
            region = server.platform.regioname
            attribute = server.attribute.attrname
            status = server.server_status.statusname
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

        return jsonify({'code': 4, 'result': 'no data.'})

    else:
        return jsonify({'code': 1, 'result': 'invalid request parameters.'})


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
