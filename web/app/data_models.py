import socket, struct
from . import db


class serveRole(db.Model):
    __tablename__ = 'server_roles'
    id = db.Column(db.Integer, primary_key=True)
    rolename = db.Column(db.String(32), nullable=False, unique=True)
    servers = db.relationship('Servers', backref='server_role')

    def __repr__(self):
        return '<serverRole %r>' % self.rolename


class Platform(db.Model):
    __tablename__ = 'platforms'
    id = db.Column(db.Integer, primary_key=True)
    platname = db.Column(db.String(32), nullable=False)
    regioname = db.Column(db.String(32), nullable=False)
    servers = db.relationship('Servers', backref='platform')

    def __repr__(self):
        return '<Platform %r>' % self.platname


class Attribute(db.Model):
    __tablename__ = 'attributes'
    id = db.Column(db.Integer, primary_key=True)
    attrname = db.Column(db.String(32), nullable=False, unique=True)
    servers = db.relationship('Servers', backref='attribute')

    def __repr__(self):
        return '<Attribute %r>' % self.attrname


class Status(db.Model):
    __tablename__ = 'server_status'
    id = db.Column(db.Integer, primary_key=True)
    statusname = db.Column(db.String(32), nullable=False, unique=True)
    servers = db.relationship('Servers', backref='server_status')

    def __repr__(self):
        return '<Status %r>' % self.statusname


class Servers(db.Model):
    __tablename__ = 'servers'
    id = db.Column(db.Integer, primary_key=True)
    hostname = db.Column(db.String(64), unique=True, index=True)
    role_id = db.Column(db.Integer, db.ForeignKey('server_roles.id'))
    plat_id = db.Column(db.Integer, db.ForeignKey('platforms.id'))
    attr_id = db.Column(db.Integer, db.ForeignKey('attributes.id'))
    servicestatus = db.Column(db.Integer, db.ForeignKey('server_status.id'))
    monitorstatus = db.Column(db.Boolean, default=False)
    ip = db.relationship('IP', backref='server')

    def __repr__(self):
        return '<Servers %r>' % self.hostname


class IPType(db.Model):
    __tablename__ = 'ip_type'
    id = db.Column(db.Integer, primary_key=True)
    ipname = db.Column(db.String(32), nullable=False, unique=True)
    ip = db.relationship('IP', backref='ip_type')

    def __repr__(self):
        return '<IPType %r>' % self.ipname


class IP(db.Model):
    __tablename__ = 'ip'
    id = db.Column(db.Integer, primary_key=True)
    address_hash = db.Column(db.BigInteger, nullable=False, unique=True)
    type_id = db.Column(db.Integer, db.ForeignKey('ip_type.id'))
    allocated = db.Column(db.Integer, db.ForeignKey('servers.id'))

    @property
    def address(self):
        return socket.inet_ntoa(struct.pack('I', socket.htonl(self.address_hash)))

    @address.setter
    def address(self, str_address):
        self.address_hash = socket.ntohl(struct.unpack("I",socket.inet_aton(str_address))[0])

    def __repr__(self):
        return '<IP %r>' % self.address
