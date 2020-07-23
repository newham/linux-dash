var alerts = {
    'cpu': '90%',
    'disk': '80%',
    'mem': '90%'
}

var email = 'onlyonemen@163.com'

var title = 'icab生产告警'

const timeout = 1800 //秒，30分钟

exports.alerts = alerts
exports.email = email
exports.timeout = timeout
exports.title = title