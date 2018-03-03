/**
 * Filename: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server/src/graphql/models/address.ts
 * Path: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server
 * Created Date: Thursday, November 23rd 2017, 4:31:49 pm
 * Author: qknow
 *
 * Copyright (c) 2017 otcgo.cn
 */


import * as graphql from 'graphql'
// import { getAssetState } from '../../services'
import * as config from 'config'
import { DBClient } from '../../lib'
import { api } from '@cityofzion/neon-js'

const dbGlobalClient: any = new DBClient(config.get('dbGlobal'))

const asset = new graphql.GraphQLObjectType({
  name: 'assets',
  description: 'This is a assets',
  fields: {
    _id: {
      type: graphql.GraphQLString
    },
    assetId: {
      type: graphql.GraphQLString
    },
    symbol: {
      type: graphql.GraphQLString,
      async resolve(asset) {
        try {
          if (!asset.symbol && asset.type === 'nep5') {
            // const result = await api.nep5.getTokenInfo(config.get('rpc'), `${asset.assetId.substring(2)}`)
            const result = await api.nep5.getTokenInfo(config.get('rpc'), `67817fa4003996bf9ecf2a55aaa7eb5ee08a8514cf8cbe9065c3e5404f2c1adc`)

            if (result.symbol)  {
              // update mongo
              const dbGlobal = await dbGlobalClient.connection()
              dbGlobal.asset.update({ _id: asset._id }, {
                $set: {
                  name: [
                    {
                      lang: 'zh-CN',
                      name: result.name || 0
                    },
                    {
                      lang: 'en',
                      name: result.name || 0
                    }
                  ],
                  amount: result.totalSupply || 0,
                  symbol: result.symbol || 0
                }
              })
              return result.symbol
            }
            //  // console.log('result', result)
          }
          return asset.symbol
        } catch (error) {
          // console.log('error', error)
        }

      }
    },
    type: {
      type: graphql.GraphQLString
    },
    name: {
      type: new graphql.GraphQLList(new graphql.GraphQLObjectType({
        name: 'assertName',
        fields: {
          lang: {
            type: graphql.GraphQLString
          },
          name: {
            type: graphql.GraphQLString
          },
        }
      }))
    },
    amount: {
      type: graphql.GraphQLString
    }
  }
})

export { asset }
