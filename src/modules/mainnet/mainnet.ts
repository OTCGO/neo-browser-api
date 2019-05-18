/**
 * Filename: /Users/wei/Desktop/otcgo/neo_scrapy/src/modules/rpx/rpx.ts
 * Path: /Users/wei/Desktop/otcgo/neo_scrapy
 * Created Date: Thursday, November 16th 2017, 12:14:47 am
 * Author: wei
 *
 * Copyright (c) 2017 Your Company
 */

import * as log4js from 'log4js'
import * as config from 'config'
import { Router } from 'express'
import { Decimal } from 'decimal.js'
import { NRequest } from '../../interface'
import * as graphqlHTTP from 'express-graphql'
import { Request as WebHandler } from '../../utils'
// import {  Asset } from '../../models'
import schema from '../../graphql'
import { api } from '@cityofzion/neon-js'
import { parallel } from '../../utils/index'
import { DBClient, client as redis } from '../../lib'

import { getRank } from '../../services'

import { getOntBalance, getAccountState, getCoinInfo, getCoinHistory } from '../../services'

import gb from '../../constant/global'



const dbGlobalClient: any = new DBClient(config.get('dbGlobal'))
const dbUtxolClient: any = new DBClient(config.get('dbUtxo'))

const logger = log4js.getLogger('mainnet')
const mainnet: Router = Router()

mainnet.use(`/public/graphql`, graphqlHTTP({
  schema,
  graphiql: true,
  pretty: true,
  extensions({
    documet,
    variables,
    operationName,
    result
  }) {
    if (result.errors) {
      result.error_code = 500
      result.error_msg = result.errors[0].message
      delete result.errors
      result.status = 'Error'
    } else {
      result.code = 200
      result.status = 'OK'
      result.server_time = new Date()
    }
  }
}))


mainnet.get(`/address/balances/:address`, async (req: NRequest, res: any) => {
  try {
    const { address } = req.params

    const cache = await redis.get(`AddressBanlance:${address}`)

    if (cache) {
      console.log('cache')
      return res.apiSuccess(JSON.parse(cache))
    }



    const dbGlobal = await dbGlobalClient.connection()


    /*
    const dbGlobal = await dbGlobalClient.connection()
    const dbUtxo = await dbUtxolClient.connection()
    const uxtos = await dbUtxo.utxos.find({address, spent_height: {$exists: false}}).toArray()



    const obj: any = {}
    for (const item of uxtos){
      if (!obj[item.asset]) {
        obj[item.asset] = []
      }
      obj[item.asset].push({prevIndex: item.index, prevHash: item.txid, value: item.value})
      // globalArr.push(obj)
    }

    const globalArr = []
    for (const key in obj) {

      const asset: any = await dbGlobal.asset.findOne({assetId: key})

      let balances: any = 0
      obj[key].forEach((utxo) => {
        balances = Decimal.add(balances, utxo.value)
      })
      if (asset.name.length > 0) {
        globalArr.push({
          assetId: key,
          name: asset.name[0].name,
          type: asset.type,
          balances
        })
      }

    }

    */

    const globalArr = []



    const neoResult: any = await getAccountState(address)

    neoResult.result.balances.forEach(element => {
      globalArr.push({
        assetId: element.asset,
        name: gb[element.asset],
        type: 'Global',
        balances: `${element.value || 0}`
      })
    });



    const asset: any = await dbGlobal.asset.find({ type: 'nep5', status: { $exists: false } }).toArray()
    const arr = []
    asset.forEach(item => {
      arr.push(async () => {
        const balances = await api.nep5.getTokenBalance(config.get('rpc'), item.assetId.substring(2), address)
        return {
          assetId: item.assetId,
          name: item.symbol,
          type: 'nep5',
          balances: `${balances || 0}`
        }
      })
    })
    const result: any = await parallel(arr, 10)

    const ontResult = await getOntBalance(address)


    const ONT_HASH = '0000000000000000000000000000000000000001'
    const ONG_HASH = '0000000000000000000000000000000000000002'


    // ONT_HASH
    result.push({
      assetId: ONT_HASH,
      name: 'ontology-ONT',
      type: 'ont',
      balances: `${ontResult[ONT_HASH] || 0}`
    }
    )

    // ONG_HASH
    result.push({
      assetId: ONG_HASH,
      name: 'ontology-ONG',
      type: 'ont',
      balances: `${ontResult[ONG_HASH] || 0}`
    }
    )



    const balance = globalArr.concat(result)
    redis.set(`AddressBanlance:${address}`, JSON.stringify(balance), 'EX', 10) // 10s

    return res.apiSuccess(balance)

    // return res.apiSuccess(globalArr.concat(result))

  } catch (error) {
    logger.error('mainnet', error)
    return res.apiError(error)
  }
})

/*
mainnet.get(`/asset/transaction/:asset`, async (req: NRequest, res: any) => {
  try {
    const { start, end } = req.query
    const { asset } = req.params

    // console.log('start',start)
    // console.log('end',end)

    const dbGlobal = await dbGlobalClient.connection()

    const list = await dbGlobal.balance.find({ assetId: asset }).skip(parseInt(start)).limit(parseInt(end)).sort({ balance: -1 }).toArray()

    const count = await dbGlobal.balance.find({ assetId: asset }).count()


    // console.log('list',list)
    return res.apiSuccess({
      count: count > 500 ? 500 : count,
      list
    })

    // const count = await redis.zcard(asset)

    // const list = await redis.zrevrange(asset, start || 0, end || 20, 'WITHSCORES')

    // return res.apiSuccess({
    //   count: count > 500 ? 500 : count,
    //   list
    // })
  } catch (error) {
    logger.error('mainnet', error)
    return res.apiError(error)
  }

})

*/

mainnet.get(`/asset/rank/:asset`, async (req: NRequest, res: any) => {
  try {
    const { start, end } = req.query
    const { asset } = req.params

    // console.log('start',start)
    // console.log('end',end)

    const cache = await redis.get(`AssetRank:${asset}:${start}:${end}`)

    if (cache) {
      console.log('cache')
      return res.apiSuccess(JSON.parse(cache))
    }

    const count = 500
    const result = await getRank(asset.substr(2),start, end)

   

    redis.set(`AssetRank:${asset}:${start}:${end}`, JSON.stringify(result), 'EX', 60 * 60) // 10s

    // console.log('list',list)
    return res.apiSuccess({
      count: count > 500 ? 500 : count,
      result
    })

    
  } catch (error) {
    logger.error('mainnet', error)
    return res.apiError(error)
  }

})

mainnet.get(`/ticker/info`, async (req: NRequest, res: any) => {
  try {

    const { symbol } = req.query

    const cache = await redis.get(`ticker:${symbol}`)

    if (cache) {
      console.log('cache')
      return res.apiSuccess(JSON.parse(cache))
    }

    const result = await getCoinInfo(symbol, {
      quotes: 'CNY,USD'
    })



    redis.set(`ticker:${symbol}`, JSON.stringify(result), 'EX', 20) // 20s


    // console.log('result',result)

    return res.apiSuccess(result)

  } catch (error) {
    logger.error('mainnet', error)
    return res.apiError(error)
  }
})


mainnet.get(`/ticker/history`, async (req: NRequest, res: any) => {
  try {
    const { start , end , interval ,symbol } = req.query

    const cache = await redis.get(`ticker:history:${symbol}:${start}:${end}:${interval}`)

    if (cache) {
      console.log('cache')
      return res.apiSuccess(JSON.parse(cache))
    }

    const result = await getCoinHistory(symbol, {
      start: start,
      end,
      interval: interval,
      quotes: 'USD'
    })

    // console.log('result',result)
    redis.set(`ticker:history:${symbol}:${start}:${end}:${interval}`, JSON.stringify(result), 'EX', 20) // 20s

    return res.apiSuccess(result)

  } catch (error) {
    logger.error('mainnet', error)
    return res.apiError(error)
  }
})

export { mainnet }



