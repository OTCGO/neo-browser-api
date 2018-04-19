import * as dotenv from 'dotenv'
dotenv.config()

import * as log4js from 'log4js'
import * as config from 'config'
import { Router } from 'express'
import { Decimal } from 'decimal.js'
import { Request as WebHandler } from '../utils'
import { api } from '@cityofzion/neon-js'
import { parallel } from '../utils/index'
import { DBClient, client as redis } from '../lib'
import * as schedule from 'node-schedule'




const dbGlobalClient: any = new DBClient(config.get('dbGlobal'))
const dbUtxolClient: any = new DBClient(config.get('dbUtxo'))

// zset

// key   address: asset
// score  balance
// value  balance

// const async = require('async')

// const q = async.queue(function (data, callback) {
//   // fork callback
//   callback()
// }, 5)

let dbGlobal = undefined
async function main() {

  dbGlobal = await dbGlobalClient.connection()
  const cursor = await dbGlobal.address.find().sort({ blockIndex: 1 })

  cursor.on('data', async (data) => {
    try {
      console.log('data', data.address)
      await getBalance(data.address)
    } catch (error) {
      console.log('error', error)
    }

    // q.push(await getBalance(data.address))

  })
  cursor.on('end', () => {
    console.log('end')
  })

  cursor.on('error', (error) => {
    console.log('error', error)
  })
}


async function getBalance(address) {

  try {
    dbGlobal = await dbGlobalClient.connection()
    const dbUtxo = await dbUtxolClient.connection()
    // console.log('address', address)
    const uxtos = await dbUtxo.utxos.find({ address, spent_height: { $exists: false } }).toArray()


    const obj: any = {}
    for (const item of uxtos) {
      if (!obj[item.asset]) {
        obj[item.asset] = []
      }
      obj[item.asset].push({ prevIndex: item.index, prevHash: item.txid, value: item.value })
      // globalArr.push(obj)
    }

    const globalArr = []
    for (const key in obj) {

      const asset: any = await dbGlobal.asset.findOne({ assetId: key })

      let balances: any = 0
      obj[key].forEach((utxo) => {
        balances = Decimal.add(balances, utxo.value)
      })


      if (asset.name.length > 0) {
        if (balances.gt(0)) {
          // console.log('balances', item.balances)
          redis.zadd(`${key.substring(2)}`, balances, address)
        }
      }
    }
    // , 'EX', parseInt(config.get('cache.redisEx')) * 60

    console.log('end', address)
  } catch (error) {
    console.log('error', error)
  }
}


// del key
async function delKey() {
  const asset: any = await dbGlobal.asset.find({}).toArray()
  for (const item of asset) {
    redis.del(`${item.assetId.substring(2)}`)
  }
}

// AUkVH4k8gPowAEpvQVAmNEkriX96CrKzk9
// getBalance('AUkVH4k8gPowAEpvQVAmNEkriX96CrKzk9')
main()

// 每天一点
// schedule.scheduleJob('0 0 1 * * *', () => {
//   main()
// })
// zRange 30e9636bc249f288139651d60f67c110c3ca4c3dd30ddfa3cbcec7bb13f14fd4 0 19