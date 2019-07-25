const request = require('request')
import * as config from 'config'

const getAssetState = async (assetId) => {
    const options = {
        method: 'POST',
        url: config.get('rpc'),
        headers:
        {
          'content-type': 'application/json'
        },
        body: {
          jsonrpc: '2.0', method: 'getassetstate', params: [assetId], id: 1
        },
        json: true
      }
      return new Promise<string>((resolve, reject) => {
        request(options, function (error, response, body) {
          if (error) return reject(error)
          return resolve(body)
        })
      })
}

const getNep5Symbol = async (assetId) => {
  const options = {
      method: 'POST',
      url: config.get('rpc'),
      headers:
      {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: '2.0', method: 'invokefunction', params: [assetId, 'symbol', []], id: 1
      },
      json: true
    }
    return new Promise<string>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) return reject(error)
        return resolve(body)
      })
    })
}


const getAccountState = async (address) => {
  const options = {
      method: 'POST',
      url: config.get('rpc'),
      headers:
      {
        'content-type': 'application/json'
      },
      body: {
        jsonrpc: '2.0', method: 'getaccountstate', params: [address], id: 1
      },
      json: true
    }
    return new Promise<string>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) return reject(error)
        return resolve(body)
      })
    })
}


const getRank = async (assetId,skip,limt) => {
  //console.log('getRank',`${config.get('RANK_API')}/v2/mainnet/rankings/${assetId}/${skip}/${limt}`)
  const options = {
      method: 'GET',
      url: `${config.get('RANK_API')}/v2/mainnet/rankings/${assetId}?index=${skip}&length=${limt}`,
      headers:
      {
        'content-type': 'application/json'
      },
      json: true
    }
    return new Promise<string>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) return reject(error)
        //console.log('body',body)
        return resolve(body)
      })
    })
}

const getBalance = async (address) => {
  //console.log('getRank',`${config.get('RANK_API')}/v2/mainnet/rankings/${assetId}/${skip}/${limt}`)
  const options = {
      method: 'GET',
      url: `${config.get('RANK_API')}/v2/mainnet/address/${address}`,
      headers:
      {
        'content-type': 'application/json'
      },
      json: true
    }
    return new Promise<string>((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) return reject(error)
        //console.log('body',body)
        return resolve(body.data)
      })
    })
}



export { getAssetState, getAccountState, getRank ,getBalance}