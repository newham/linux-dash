// 百分比
var alerts = {
    'cpu': 90,
    'disk': 80,
    'mem': 90
}

var emails = ['onlyonemen@163.com', '448321473@qq.com', 'fulin_1990sh@163.com']

var title = 'icab生产告警'

const timeout = 1800 //秒，30分钟

exports.alerts = alerts
exports.emails = emails
exports.timeout = timeout
exports.title = title