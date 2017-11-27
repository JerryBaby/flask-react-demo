from flask import jsonify
from . import server
from ..data_models import serverRole, Platform, Status, \
    Servers, IPType, IP




@server.route('/get_servers')
def get_servers():
    res = []
    servers = Servers.query.all()
    for s in servers:
        hostname=s.hostname
        role = s.server_role.rolename
        platform = s.platform.platname
        status = s.server_status.statusname
        ip = s.ip
        ips = []
        for i in ip:
            ips.append(i.read() + '('+ i.ip_type.ipname + ')')
        res.append({'hostname': hostname, 'role': role, 'platform': platform, 'ip': ips, 'status': status})

    return jsonify({'result': res})
