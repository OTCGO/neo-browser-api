/**
 * Filename: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server/src/graphql/query.ts
 * Path: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server
 * Created Date: Thursday, November 23rd 2017, 4:25:17 pm
 * Author: qknow
 *
 * Copyright (c) 2017 otcgo.cn
 */

import * as graphql from 'graphql'
import * as config from 'config'
import * as _ from 'lodash'
import * as async from 'async'
import { address, transaction, asset, block, system } from './models'
// import { Address, Transaction, Asset } from '../models'
import { queryBuilder, argsBuilder, pageQuery } from '../utils'
import { DBClient, client as redis } from '../lib'




const dbGlobalClient: any = new DBClient(config.get('dbGlobal'))



const query = new graphql.GraphQLObjectType({
  name: 'query',
  description: 'This is a root query',
  fields: {
    AddressQuery: {
      type: new graphql.GraphQLNonNull(new graphql.GraphQLObjectType({
        name: 'AddressQuery',
        fields: {
          count: {
            type: graphql.GraphQLInt
          },
          rows: {
            type: new graphql.GraphQLList(address)
          }
        }
      })),
      args: argsBuilder({
        _id: {
          type: graphql.GraphQLString
        },
        address: {
          type: graphql.GraphQLString
        }
      }),
      async resolve(root, args) {

        try {


          const cache = await redis.get(`AddressQuery:${JSON.stringify(args)}`)

          if (cache) {
            console.log('cache')
            return JSON.parse(cache)
          }

          const dbGlobal = await dbGlobalClient.connection()
          const result = await pageQuery(args.skip, args.limit, dbGlobal.address, undefined, queryBuilder({}, args), { blockIndex: -1 })


          redis.set(`AddressQuery:${JSON.stringify(args)}`, JSON.stringify(result), 'EX', 10) // 10s

          return result

        } catch (error) {
          console.log('AddressQuery', error)
        }

      }
    },
    TransactionQuery: {
      type: new graphql.GraphQLNonNull(new graphql.GraphQLObjectType({
        name: 'TransactionQuery',
        fields: {
          count: {
            type: graphql.GraphQLInt
          },
          rows: {
            type: new graphql.GraphQLList(transaction)
          }
        }
      })),
      args: argsBuilder({
        _id: {
          type: graphql.GraphQLString
        },
        txid: {
          type: graphql.GraphQLString
        },
        blockIndex: {
          type: graphql.GraphQLInt
        },
        type: {
          type: graphql.GraphQLString
        },
        address: {
          type: graphql.GraphQLString
        },
        asset: {
          type: graphql.GraphQLString
        }
      }),
      async resolve(root, args) {

        // test AGwJpXGPowiJfMFAdnrdB1uV92i4ubPANA
        if (args.address) {
          // args['vout.address'] = args.address
          args.$or = [
            { 'vout.address': args.address },
            { vin: { $elemMatch: { 'utxo.address': args.address } } },
            { 'nep5.to': args.address },
            { 'nep5.from': args.address }
          ]
          delete args.address
          // const dbGlobal = await dbGlobalClient.connection()
          // return  pageQuery(args.skip, args.limit, dbGlobal.transaction, undefined, queryBuilder({}, args), { blockIndex: -1 })
        }

        const dbGlobal = await dbGlobalClient.connection()
        // asset
        if (args.asset) {
          const asset = await dbGlobal.asset.findOne({ assetId: args.asset })
          if (asset.type === 'nep5') {
            args.$or = [
              { 'nep5.assetId': args.asset },
            ]
          } else {
            args.$or = [
              { 'vout.asset': args.asset },
              { vin: { $elemMatch: { 'utxo.asset': args.asset } } }
            ]
          }

          delete args.asset
        }


        try {
          const cache = await redis.get(`TransactionQuery:${JSON.stringify(args)}`)
          if (cache) {
            console.log('cache get')
            return JSON.parse(cache)
          }


          // console.log('database get')
          const result = await pageQuery(args.skip, args.limit, dbGlobal.transaction, undefined, queryBuilder({}, args), { blockIndex: -1 })
          await redis.set(`TransactionQuery:${JSON.stringify(args)}`, JSON.stringify(result), 'EX', 10) // 10s
          // console.log('database get',JSON.stringify(args))
          return result

        } catch (error) {
          console.log('TransactionQuery', error)
        }



        // return pageQuery(args.skip, args.limit, dbGlobal.transaction, undefined, queryBuilder({}, args), { blockIndex: -1 })

      }
    },
    AssetQuery: {
      type: new graphql.GraphQLNonNull(new graphql.GraphQLObjectType({
        name: 'AssetQuery',
        fields: {
          count: {
            type: graphql.GraphQLInt
          },
          rows: {
            type: new graphql.GraphQLList(asset)
          }
        }
      })),
      args: argsBuilder({
        _id: {
          type: graphql.GraphQLString
        },
        assetId: {
          type: graphql.GraphQLString
        },
        contract: {
          type: graphql.GraphQLString
        },
        symbol: {
          type: graphql.GraphQLString
        },
        search: {
          type: graphql.GraphQLString
        }
      }),
      async resolve(root, args) {


      try {

        // console.log('args',JSON.stringify(args))
        const cache = await redis.get(`AssetQuery:${JSON.stringify(args)}`)
        if (cache) {
          console.log('cache get')
          return JSON.parse(cache)
        }

        // if search
        if (args.search) {
          args.$or = [
            { assetId: new RegExp(args.search, 'i') },
            { 'name.name': new RegExp(args.search, 'i') },
            { type: new RegExp(args.search, 'i') },
            { symbol: new RegExp(args.search, 'i') }
          ]

          delete args.search
        }

        const dbGlobal = await dbGlobalClient.connection()




          // console.log('database get')
          const result = await pageQuery(args.skip, args.limit, dbGlobal.asset, undefined, queryBuilder({ status: { $exists: false } }, args), {})
          await redis.set(`AssetQuery:${JSON.stringify(args)}`, JSON.stringify(result), 'EX', 60 * 60) // 1 min
          // console.log('database get',JSON.stringify(args))
          return result

        } catch (error) {
          console.log('AssetQuery', error)
        }

        // return pageQuery(args.skip, args.limit, dbGlobal.asset, undefined, queryBuilder({ status: { $exists: false } }, args), {})

        // const dbNep5 = await dbNep5Client.connection()
        // const resultNep5: any  = await pageQuery(args.skip, 0, dbNep5.nep5_m_assets, undefined, queryBuilder({}, args), {})



        // return {
        //   count: resultGlo.count + resultNep5.count,
        //   rows: _.union(resultGlo.rows, resultNep5.rows),
        // }
        // return  pageQuery(args.skip, args.limit, Asset, '', queryBuilder({}, args))
      }
    },
    BlockQuery: {
      type: new graphql.GraphQLNonNull(new graphql.GraphQLObjectType({
        name: 'BlockQuery',
        fields: {
          count: {
            type: graphql.GraphQLInt
          },
          rows: {
            type: new graphql.GraphQLList(block)
          }
        }
      })),
      args: argsBuilder({
        _id: {
          type: graphql.GraphQLString
        },
        index: {
          type: graphql.GraphQLInt
        }
      }),
      async resolve(root, args) {

        try {
          const cache = await redis.get(`BlockQuery:${JSON.stringify(args)}`)
          if (cache) {
            console.log('cache get')
            return JSON.parse(cache)
          }


          // console.log('database get')
          const dbGlobal = await dbGlobalClient.connection()
          const result = await pageQuery(args.skip, args.limit, dbGlobal.block, undefined, queryBuilder({}, args), { index: -1 }, {})
          await redis.set(`BlockQuery:${JSON.stringify(args)}`, JSON.stringify(result), 'EX', 10) // 10s
          // console.log('database get',JSON.stringify(args))
          return result

        } catch (error) {
          console.log('BlockQuery', error)
        }


        // return pageQuery(args.skip, args.limit, dbGlobal.block, undefined, queryBuilder({}, args), { index: -1 }, {})
      }
    },
    SystemQuery: {
      type: new graphql.GraphQLNonNull(new graphql.GraphQLObjectType({
        name: 'SystemQuery',
        fields: {
          rows: {
            type: system
          }
        }
      })),
      args: argsBuilder({
        _id: {
          type: graphql.GraphQLString
        }
      }),
      async resolve(root, args) {

        try {
          const cache = await redis.get(`SystemQuery`)
          if (cache) {
            console.log('cache get')
            return JSON.parse(cache)
          }


          // console.log('database get')
          // const dbGlobal = await dbGlobalClient.connection()
          // const result = await pageQuery(args.skip, args.limit, dbGlobal.block, undefined, queryBuilder({}, args), { index: -1 }, {})
          // // await redis.set(`BlockQuery:${JSON.stringify(args)}`, JSON.stringify(result), 'EX', 60 * 60) // 10s
          // // console.log('database get',JSON.stringify(args))
          // return result





          const dbGlobal = await dbGlobalClient.connection()
          const blockNumMinObj = await dbGlobal.block.find({}, { index: 1, time: 1 }).sort({ index: 1 }).limit(1).toArray()
          // console.log('blockNumMinObj', blockNumMinObj)
          const blockNumMaxObj = await dbGlobal.block.find({}, { index: 1, time: 1 }).sort({ index: -1 }).limit(1).toArray()
          // console.log('blockNum', blockNumMaxObj)

          const assetNum = await dbGlobal.asset.find({ status: { $exists: false } }).count()
          // console.log('assetObj', assetNum)

          const addressNum = await dbGlobal.address.find().count()
          // console.log('addressObj', addressNum)

          const transactionNum = await dbGlobal.transaction.find().count()
          // console.log('transactionObj', transactionNum)


          const result = {
            rows: {
              startTime: blockNumMinObj[0].time,
              curretTime: blockNumMaxObj[0].time,
              blockNum: blockNumMaxObj[0].index + 1,
              assetNum,
              addressNum,
              transactionNum
            }
          }
          await redis.set(`SystemQuery`, JSON.stringify(result), 'EX', 10) // 10s
          // console.log('database get',JSON.stringify(args))
          return result
          // return {
          //   rows: {
          //     startTime: blockNumMinObj[0].time,
          //     curretTime: blockNumMaxObj[0].time,
          //     blockNum: blockNumMaxObj[0].index + 1,
          //     assetNum,
          //     addressNum,
          //     transactionNum
          //   }
          // }

        } catch (error) {
          console.log('SystemQuery', error)
        }
        // return  pageQuery(args.skip, args.limit, dbGlobal.block, undefined, queryBuilder({}, args), { index: -1 }, { })
      }
    },
  }
})

export default query