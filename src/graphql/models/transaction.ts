/**
 * Filename: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server/src/graphql/models/address.ts
 * Path: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server
 * Created Date: Thursday, November 23rd 2017, 4:31:49 pm
 * Author: qknow
 *
 * Copyright (c) 2017 otcgo.cn
 */


import * as graphql from 'graphql'
// import {  Asset } from '../../models'
import { DBClient } from '../../lib'
import * as config from 'config'



const dbGlobalClient: any = new DBClient(config.get('dbGlobal'))


const assetObj = {}

const transaction = new graphql.GraphQLObjectType({
  name: 'transaction',
  description: 'This is a transaction',
  fields: {
    _id: {
      type: graphql.GraphQLString
    },
    txid: {
      type: graphql.GraphQLString
    },
    /*
    to: {
     type: new graphql.GraphQLObjectType({
       name: 'toAddress',
       fields: {
          value: {
            type: graphql.GraphQLString
          },
          hash: {
            type: graphql.GraphQLString
          }
       }
     })
    },
    from: {
      type: new graphql.GraphQLObjectType({
        name: 'fromAddress',
        fields: {
           value: {
             type: graphql.GraphQLString
           },
           hash: {
             type: graphql.GraphQLString
           }
        }
      })
    },
    symbol: {
      type: graphql.GraphQLString,
      async resolve (address) {
        const asset = await Asset.findOne({contract: address.contract})
        return asset.symbol
      }
    },
    value: {
      type: graphql.GraphQLString
    },
    */
    blockIndex: {
      type: graphql.GraphQLInt
    },
    size: {
      type: graphql.GraphQLInt
    },
    type: {
      type: graphql.GraphQLString
    },
    sys_fee: {
      type: graphql.GraphQLString
    },
    net_fee: {
      type: graphql.GraphQLString
    },
    scripts: {
      type: new graphql.GraphQLList(new graphql.GraphQLObjectType({
        name: 'scripts',
        fields: {
          invocation: {
             type: graphql.GraphQLString
           },
           verification: {
             type: graphql.GraphQLString
           }
        }
      }))
    },
    // attributes: {
    //   type: graphql.GraphQLString
    // },
    vin: {
      type: new graphql.GraphQLList(new graphql.GraphQLObjectType({
        name: 'vin',
        description: 'This is a vin',
        fields: {
          vout: {
            type: graphql.GraphQLInt
          },
          txid: {
            type: graphql.GraphQLString
          },
          utxo: {
            type: new graphql.GraphQLObjectType({
              name: 'info',
              description: 'This is a info',
              fields: {
                address: {
                  type: graphql.GraphQLString
                },
                value: {
                  type: graphql.GraphQLString
                },
                asset: {
                  type: graphql.GraphQLString
                },
                name: {
                  type: graphql.GraphQLString,
                  async resolve (utxo) {
                    try {
                      // console.log('assetObj[nep5.assetId]', assetObj[nep5.assetId])
                      if (utxo && !assetObj[utxo.asset]) {
                       const dbGlobal = await dbGlobalClient.connection()
                       const reulst = await dbGlobal.asset.findOne({assetId: utxo.asset})
                       assetObj[utxo.asset] = reulst.name[0].name

                      }

                      return assetObj[utxo.asset]

                     } catch (error) {
                      // console.error('vout:error', error)
                     }
                  }
                },
              },
            }),
          //  async resolve (vin, args) {
          //     try {
          //       if (vin) {
          //         const dbGlobal = await dbGlobalClient.connection()
          //         const result = await dbGlobal.b_neo_m_transactions.findOne({txid: vin.txid}, {vout: 1})
          //         console.log('args', args)
          //         return result.vout[vin.vout]
          //       }
          //     } catch (error) {
          //       console.error('error:vin', error)
          //     }
          //   }
          }

        }
      }))
    },
    vout: {
      type: new graphql.GraphQLList(new graphql.GraphQLObjectType({
        name: 'vout',
        description: 'This is a vout',
        fields: {
          address: {
            type: graphql.GraphQLString
          },
          value: {
            type: graphql.GraphQLString
          },
          asset: {
            type: graphql.GraphQLString
          },
          n: {
            type: graphql.GraphQLInt
          },
          name: {
            type: graphql.GraphQLString,
            async resolve (vout) {
                try {
                  // console.log('assetObj[nep5.assetId]', assetObj[nep5.assetId])
                  if (vout && !assetObj[vout.asset]) {
                   const dbGlobal = await dbGlobalClient.connection()
                   const reulst = await dbGlobal.asset.findOne({assetId: vout.asset})
                   assetObj[vout.asset] = reulst.name[0].name

                  }
                  console.log('assetObj[vout.asset]', assetObj)
                  return assetObj[vout.asset]

                 } catch (error) {
                  // console.error('vout:error', error)
                 }

            }
          }
        }
      }))
    },
    nep5: {
      type: new graphql.GraphQLList(new graphql.GraphQLObjectType({
        name: 'nep5',
        description: 'This is a nep5',
        fields: {
          to: {
            type: graphql.GraphQLString,
           },
           from: {
             type: graphql.GraphQLString,
           },
           symbol: {
             type: graphql.GraphQLString,
             async resolve (nep5) {
               try {
                // console.log('assetObj[nep5.assetId]', assetObj[nep5.assetId])
                if (nep5 && !assetObj[nep5.assetId]) {
                 const dbGlobal = await dbGlobalClient.connection()
                 const reulst = await dbGlobal.asset.findOne({assetId: nep5.assetId})
                 // console.log('reulst', reulst)
                 assetObj[nep5.assetId] = reulst.symbol
                }

                return assetObj[nep5.assetId]
               } catch (error) {
                // console.error('nep5:error', error)
               }
             }
           },
           value: {
             type: graphql.GraphQLString
           },
           operation: {
            type: graphql.GraphQLString
          },
          assetId: {
            type: graphql.GraphQLString
          }
        }
      })),
      // async resolve (transaction) {
      //   if (transaction.type === 'InvocationTransaction') {
      //     const dbNep5 = await dbNep5Client.connection()
      //     return dbNep5.nep5_m_transactions.findOne({txid: transaction.txid})
      //   }

      // }
    }
  }
})

export { transaction }

/*
{
  "_id" : ObjectId("5a6be77f8fd7c724493cb174"),
  "txid" : "0xdecbdc420b4a1081c0e8b4cd87f09b297b8e07112b58203725973041be5c2caa",
  "size" : 10,
  "type" : "MinerTransaction",
  "version" : 0,
  "sys_fee" : 0,
  "net_fee" : 0,
  "blockIndex" : 14,
  "scripts" : [],
  "vout" : [
      {
          "address" : "AQ3c2yWjSwm6M2ukBoEYnEPybyRDHscvno",
          "value" : 9,
          "asset" : "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
          "n" : 0
      }
  ],
  "vin" : [
      {
          "vout" : 0,
          "txid" : "0xa7873afc5439140818bec9a10af5117ed09d9e07d5bf0a28897f22618fdfae31"
      }
  ],
  "attributes" : [],
  "__v" : 0
  nep5:[]
}

*/