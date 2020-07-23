var http = require('http');

var sent_mail = (address, title, msg) => {
    var url = encodeURI(`http://liuxingw.com/api/mail/api.php/?address=${address}&name=${title}&certno=${msg}`)
    http.get(url, (req) => {
        var body = ''
            //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        req.on('data', function(chunk) {
            // console.log(data);
            body += chunk
        });
        //end事件
        req.on('end', function() {
            // console.log('end');
            json_data = JSON.parse(body) //解析为json对象
            console.log('sent email:', json_data.msg)
        });
    });
}

// 测试用
// sent_mail('onlyonemen@163.com', 'linux监控', '硬盘不足')

exports.sent_mail = sent_mail //nodejs 规范