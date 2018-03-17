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
import { DBClient } from '../lib'




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
      async resolve (root, args) {
        // if (args.address) {
        //   args.$or = [
        //     {'address.value': args.address},
        //     {'address.hash': args.address},
        //   ]
        //   delete args.address
        // }
         const dbGlobal = await dbGlobalClient.connection()
         return  pageQuery(args.skip, args.limit, dbGlobal.address, undefined, queryBuilder({}, args), { blockIndex: -1 })
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
        }
      }),
      async resolve (root, args) {

        // test AGwJpXGPowiJfMFAdnrdB1uV92i4ubPANA
        if (args.address) {
          // args['vout.address'] = args.address
           args.$or = [
            {'vout.address': args.address},
            {vin: {$elemMatch: {'utxo.address': args.address }}},
            {'nep5.to':  args.address},
            {'nep5.from':  args.address}
          ]
          delete args.address
          const dbGlobal = await dbGlobalClient.connection()
          return  pageQuery(args.skip, args.limit, dbGlobal.transaction, undefined, queryBuilder({}, args), { blockIndex: -1 })
        }


        const dbGlobal = await dbGlobalClient.connection()
        return  pageQuery(args.skip, args.limit, dbGlobal.transaction, undefined, queryBuilder({}, args), { blockIndex: -1 })
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
      }),
      async resolve (root, args) {
        const dbGlobal = await dbGlobalClient.connection()
        return pageQuery(args.skip, args.limit, dbGlobal.asset, undefined, queryBuilder({}, args), {})

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
      async resolve (root, args) {
        const dbGlobal = await dbGlobalClient.connection()
        return  pageQuery(args.skip, args.limit, dbGlobal.block, undefined, queryBuilder({}, args), { index: -1 }, { })
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
      async resolve (root, args) {
        const dbGlobal = await dbGlobalClient.connection()


        const blockNumMinObj  = await dbGlobal.block.find({}, {index: 1, time: 1}).sort({index: 1}).limit(1).toArray()
        console.log('blockNumMinObj', blockNumMinObj)
        const blockNumMaxObj  = await dbGlobal.block.find({}, {index: 1, time: 1}).sort({index: -1}).limit(1).toArray()
        // console.log('blockNum', blockNumMaxObj)

        const assetNum = await dbGlobal.asset.find().count()
        // console.log('assetObj', assetNum)

        const addressNum = await dbGlobal.address.find().count()
       // console.log('addressObj', addressNum)

        const transactionNum = await dbGlobal.transaction.find().count()
       // console.log('transactionObj', transactionNum)

        return {
          rows: {
            startTime:  blockNumMinObj[0].time,
            curretTime: blockNumMaxObj[0].time,
            blockNum: blockNumMaxObj[0].index + 1,
            assetNum,
            addressNum,
            transactionNum
          }
        }
       // return  pageQuery(args.skip, args.limit, dbGlobal.block, undefined, queryBuilder({}, args), { index: -1 }, { })
      }
    },
  }
})

export default query