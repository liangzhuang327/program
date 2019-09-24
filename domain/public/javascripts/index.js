(function () {
    $('.submit').click(function () {
        var name = $('.name').val();
        if (!name) {
            alert('name为空');
            return;
        }
        var regName = /^[0-9a-zA-Z]*$/
        if (!regName.test(name)) {
            alert('用户名格式错误，只能是字母／数字／字母和数字的组合')
            return
        }
        var ip = $('.ip').val();
        if (!ip) {
            alert('ip为空');
            return;
        }
        var regIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!regIp.test(ip)) {
            alert('ip格式错误');
            return;
        }
        var port = $('.port').val();
        var regPort = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/
        if (!regPort.test(port)){
            alert('端口格式错误，只能是1-65535的纯数字');
            return;
        }
        var iport = port ? ip + ':' + port : ip;
        var data = {
            name: name,
            password: $('.password').val(),
            iport: iport
        };
        $.ajax({
            type: 'GET',
            url: 'client/getDomain',
            data: data,
            dataType: 'json',
            success: function (result) {
                if (result.code !== 200) {
                    $('.domain').text(result.message);
                    return;
                }
                $('.domain').text(result.data.domain);
            }
        });
    });
})();
