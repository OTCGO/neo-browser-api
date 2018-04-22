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
const async = require('async')


const dbGlobalClient: any = new DBClient(config.get('dbGlobal'))
const dbUtxolClient: any = new DBClient(config.get('dbUtxo'))

// zset

// key   address: asset
// score  balance
// value  balance


let dbGlobal = undefined
let cursor = undefined
let asset = undefined
async function main() {

  dbGlobal = await dbGlobalClient.connection()
  cursor = await dbGlobal.address.find().sort({ blockIndex: 1 })


  dbGlobal = await dbGlobalClient.connection()
  asset = await dbGlobal.asset.find({ type: 'nep5', status: { $exists: false } }).toArray()

  cursor.on('data', async (data) => {
    try {

      if (/^A/.test(data.address)) {
        console.log('data', data.address)
        q.push(data.address)

        // await getBalance(data.address)
      }

    } catch (error) {
      console.log('error', error)
    }
  })
  cursor.on('end', () => {
    console.log('end')
  })

  cursor.on('error', (error) => {
    console.log('error', error)
  })

}


const q = async.queue(async (data, callback) => {
  try {
    const address = data
    for (const item of asset) {
      // fork callback
      const balances = await api.nep5.getTokenBalance(await getNode(), item.assetId.substring(2), address)
      console.log('balances', balances)
      if (balances) {
        await redis.zadd(`${item.assetId.substring(2)}`, new Decimal(balances || 0), address)
      }
    }
    callback()
  } catch (error) {
    callback()
    console.log('error', error)
  }


}, 10)
/*
function getBalance(address) {
  console.log('getBalance', address)
  return new Promise(async (resolve, reject) => {
    try {
      for (const item of asset) {
        q.push({ item, address })
        // const balances = await api.nep5.getTokenBalance(await getNode(), item.assetId.substring(2), address)
        // if (balances) {
        //   redis.zadd(`${item.assetId.substring(2)}`, balances, JSON.stringify({
        //     address,
        //     balances: new Decimal(`${balances || 0}`)
        //   }))
        // }
      }

      return resolve()
    } catch (error) {

      // console.log('error', error)
      return reject()
    }
  })
}

*/
async function getNode() {
  const arr: any[] = config.get('rpclist') || []
  const node = arr[Math.floor(Math.random() * arr.length)]
  console.log('node', node)
  return node
}

// AUkVH4k8gPowAEpvQVAmNEkriX96CrKzk9
// getBalance('AUkVH4k8gPowAEpvQVAmNEkriX96CrKzk9')
// main()

// 每周二5点
schedule.scheduleJob('0 0 5 * * 2', () => {
  main()
})
// ZREVRANGE acbc532904b6b51b5ea6d19b803d78af70e7e6f9 0 19 WITHSCORES

