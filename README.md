全部接口只接受 json 请求，返回 JSON 数据

## code:

* 0: 请求成功
* 1: invalid parameters.
* 2: user not registered.
* 3: incorrect password.
* 4: no data.
* 5: duplicate host name.
* 6: duplicate IP address.
* 7: invalid IP address.
* 8: database session exception.
* ...

## URL:

#### 用户页面

* http://localhost/: 主页 index，图表
* http://localhost/servers: 服务器资产界面
* http://localhost/users: 用户管理界面
* http://localhost/cmdb: 配置管理平台界面

#### API

* http://localhost/server\_api/\*: 服务器资产相关接口
    * http://localhost/server\_api/get\_servers: 获取服务器资产信息
    * http://localhost/server\_api/server\_add: 添加服务器
    * http://localhost/server\_api/server\_del: 删除服务器
    * http://localhost/server\_api/server\_modify: 修改服务器
    *
    * http://localhost/server\_api/get\_roles: 获取服务器角色信息
    * http://localhost/server\_api/role\_add: 添加服务器角色
    * http://localhost/server\_api/role\_del: 删除服务器角色
    * http://localhost/server\_api/role\_modify: 修改服务器角色
    *
    * http://localhost/server\_api/get\_platforms: 获取云平台信息
    * http://localhost/server\_api/platform\_add: 添加云平台
    * http://localhost/server\_api/platform\_del: 删除云平台
    * http://localhost/server\_api/platform\_modify: 修改云平台

* http://localhost/dashboard\_api/\*: dashboard 相关接口
    * http://localhost/

* http://localhost/user\_api/\*: 用户相关接口
* http://localhost/cmdb\_api/\*: 配置相关接口
