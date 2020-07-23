var mail = require('./mail')
var conf = require('./conf')
    // const { config } = require('yargs')
var spawn = require('child_process').spawn

var nixJsonAPIScript = '../../server/linux_json_api.sh'

var sent_time = { cpu: 0, mem: 0, disk: 0 }

function getPluginData(pluginName, callback) {

    var command = spawn(nixJsonAPIScript, [pluginName, ''])
    var data = ''

    command.stdout.on('data', (chunk) => {
        data += chunk
    })

    command.on('close', (code) => {
        // console.log('data:', pluginName, data)
        callback(code, data)
    })

    command.on('error', (e) => {
        console.log(e)
    })

}

function sentMsg(type, msg) {
    var now = Date.parse(new Date());
    if (sent_time[type] == 0 || (now - sent_time[type]) / 1000 > conf.timeout) {
        sent_time[type] = now
        console.log(new Date().toLocaleDateString(), msg)
            // mail.sent_mail(conf.emails, conf.title, msg)
    }
}

function filterTask() {
    getPluginData('disk_partitions', (code, outputs) => {
        if (code != 0) {
            console.log(outputs)
            return
        }
        outputs = JSON.parse(outputs)
        var max = conf.alerts.disk
        for (i in outputs) {
            var output = outputs[i]
            var value = parseInt(output['used%'].replace('%', '')) //将10%转换为10
            if (value > max) {
                var msg = `[ALERT]:[disk:${output['mounted']}][${value}%]>[${max}%]`
                sentMsg('disk', msg)
            }
        }

    })

    getPluginData('cpu_utilization', (code, outputs) => {
        if (code != 0) {
            console.log(outputs)
            return
        }
        var value = outputs
        var max = conf.alerts.cpu
        if (value > max) {
            var msg = `[ALERT]:[cpu][${value}%]>[${max}%]`
            sentMsg('cpu', msg)
        }
    })

    // { "total": 1991.12, "used": 445.711, "available": 1545.41 }
    getPluginData('current_ram', (code, outputs) => {
        if (code != 0) {
            console.log(outputs)
            return
        }
        outputs = JSON.parse(outputs)
        var max = conf.alerts.mem
        var value = parseInt(outputs.used / outputs.total * 100)
        if (value > max) {
            var msg = `[ALERT]:[mem][${value}%]>[${max}%]`
            sentMsg('mem', msg)
        }
    })
}


// 每x1000秒执行一次
setInterval(filterTask, 1000)

//getPluginData('cpu_info', (code, output) => {
//    console.log(code, output)
//})

// sent_mail('onlyonemen@163.com', 'linux监控', '硬盘不足')