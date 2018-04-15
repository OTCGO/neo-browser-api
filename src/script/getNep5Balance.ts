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




const dbGlobalClient: any = new DBClient(config.get('dbGlobal'))
const dbUtxolClient: any = new DBClient(config.get('dbUtxo'))

// zset

// key   address: asset
// score  balance
// value  balance



async function main() {

  const dbGlobal = await dbGlobalClient.connection()
  const cursor = await dbGlobal.address.find().sort({ blockIndex: 1 })

  // cursor.forEach(async data => {
  //   await getBalance(data.address)
  //   console.log('data')
  // })
  cursor.on('data', async (data) => {
    try {
      getBalance(data.address)

      console.log('data')

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


function getBalance(address) {
  console.log('getBalance', address)
  return new Promise(async (resolve, reject) => {
    try {
      const dbGlobal = await dbGlobalClient.connection()
      const asset: any = await dbGlobal.asset.find({ type: 'nep5', status: { $exists: false } }).toArray()
      const arr = []

      asset.forEach(item => {
        arr.push(async () => {
          const balances = await api.nep5.getTokenBalance(await getNode(), item.assetId.substring(2), address)
          return {
            assetId: item.assetId,
            name: item.symbol,
            type: 'nep5',
            balances: new Decimal(`${balances || 0}`)
          }
        })
      })
      const result: any = await parallel(arr, 5)
      result.forEach((item) => {
        // console.log('balances', item)
        if (item.balances.gt(0)) {
          // console.log('balances', item.balances)
          redis.zadd(`${item.assetId.substring(2)}`, item.balances, JSON.stringify({
            address,
            balances: item.balances
          }))
        }

      })

      console.log('end', address)
      return resolve()
    } catch (error) {
      console.log('error', error)
      return reject()
    }
  })
}

async function getNode() {
  const arr: any[] = config.get('rpclist') || []
  const node = arr[Math.floor(Math.random() * arr.length)]
  // console.log('node', node)
  return node
}

// AUkVH4k8gPowAEpvQVAmNEkriX96CrKzk9
// getBalance('AUkVH4k8gPowAEpvQVAmNEkriX96CrKzk9')
main()

// ZREVRANGE c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b 0 19