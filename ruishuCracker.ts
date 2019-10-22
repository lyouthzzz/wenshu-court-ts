import jsdom = require("jsdom");
import axios = require('axios');
const { random, cipherText, DES3 } = require('./Decrypt');

(async function doCrack() {
    let indexUrl = 'http://wenshu.court.gov.cn/';
    const cookieJar = new jsdom.CookieJar();
    let options: jsdom.FromUrlOptions = {
        runScripts: 'dangerously',
        cookieJar: cookieJar
    }
    let dom = await jsdom.JSDOM.fromURL(indexUrl, options);
    dom.window.close();

    // let HM4hUBT0dDOn80S = cookieJar.store.idx['wenshu.court.gov.cn']['/']['HM4hUBT0dDOn80S'].value;
    // let HM4hUBT0dDOn80T = cookieJar.store.idx['wenshu.court.gov.cn']['/']['HM4hUBT0dDOn80T'].value;
    let cookie: string = '';
    cookieJar.getCookieString('http://wenshu.court.gov.cn/', (err, cookies) => {
        if (err) {
            console.log(err);
        }
        cookie = cookies;
    });
    
    if (!cookie.includes('HM4hUBT0dDOn80S') || !cookie.includes('HM4hUBT0dDOn80T')) {
        console.log('Get cookie failed ');
        return;
    }
    let postUrl = 'http://wenshu.court.gov.cn/website/parse/rest.q4w';
    let config: axios.AxiosRequestConfig = {
        headers: {
            'Host': 'wenshu.court.gov.cn',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'http://wenshu.court.gov.cn/website/wenshu/181217BMTKHNT2W0/index.html',
            'Cookie': cookie
        },
        transformRequest: [function (data) {
            let retData = '';
            for (let param in data) {
                retData += encodeURIComponent(param) + '=' + encodeURIComponent(data[param]) + '&';
            }
            return retData
        }]
    }
    let detailBody = {
        'docId': '6dd3f5145ca9492198b06a7ce72fe74b',
        'ciphertext': cipherText(),
        '__RequestVerificationToken': random(24),
        'cfg': 'com.lawyee.judge.dc.parse.dto.SearchDataDsoDTO@docInfoSearch'
    }
    let response: axios.AxiosResponse = await axios.default.post(postUrl, detailBody, config);
    if (response.status === 200) {
        let text = DES3.decrypt(response.data.result, response.data.secretKey);
        console.log(text);
    }

})();