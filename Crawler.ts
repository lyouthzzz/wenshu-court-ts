import axios = require('axios');
const { cipher, DES3 } = require('./Decrypt');

(async function download() {
    let url = 'http://wenshu.court.gov.cn/website/parse/rest.q4w';
    let data = {
        's8': '03',
        'sortFields': 's50:desc',
        'ciphertext': cipher(),
        'pageNum': 1,
        'queryCondition': JSON.stringify([{ "key": "s8", "value": "03" }]),
        'cfg': 'com.lawyee.judge.dc.parse.dto.SearchDataDsoDTO@queryDoc'
    }

    let config: axios.AxiosRequestConfig = {
        headers: {
            'Host': 'wenshu.court.gov.cn',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'http://wenshu.court.gov.cn/website/wenshu/181217BMTKHNT2W0/index.html'
        },
        transformRequest: [function (data) {
            let retData = '';
            for (let it in data) {
                retData += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return retData
        }],
    }

    let response: axios.AxiosResponse = await axios.default.post(url, data, config);
    if (response.status === 200) {
        let text = DES3.decrypt(response.data.result, response.data.secretKey);
        console.log(text);
    }
})();
