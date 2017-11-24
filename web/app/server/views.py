


from . import server







@server.route('/test')
def test():
    return "Hello, world"
