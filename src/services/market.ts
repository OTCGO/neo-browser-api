
const request = require('request')
import * as config from 'config'



const getCoinInfo = async (symbol,qs) => {
    const options = { method: 'GET',
    url: `${config.get('marketAPI')}/v1/tickers/`+symbol,
    qs:qs,
    headers: {  
        'content-type': 'application/json'
    }};
    
    
    return new Promise<string>((resolve, reject) => {
        request(options, function (error, response, body) {
            console.log('getQuotesLatest',body)
            if (error) return reject(error)
            return resolve(JSON.parse(body))
        })
    })
}

const getCoinHistory = async (symbol,qs) => {
    const options = { method: 'GET',
    url: `${config.get('marketAPI')}/v1/tickers/${symbol}/historical`,
    qs:qs,
    headers: {  
        'content-type': 'application/json'
    }};
    
    
    return new Promise<string>((resolve, reject) => {
        request(options, function (error, response, body) {
            console.log('getQuotesLatest',body)
            if (error) return reject(error)
            return resolve(JSON.parse(body))
        })
    })
}






export { getCoinInfo ,getCoinHistory}