/**
 * Filename: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server/src/graphql/models/address.ts
 * Path: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server
 * Created Date: Thursday, November 23rd 2017, 4:31:49 pm
 * Author: qknow
 *
 * Copyright (c) 2017 otcgo.cn
 */


import * as graphql from 'graphql'

const system = new graphql.GraphQLObjectType({
  name: 'system',
  description: 'This is a system',
  fields: {
    startTime: {
        type: graphql.GraphQLString
    },
    curretTime: {
        type: graphql.GraphQLString
    },
    blockNum: {
        type: graphql.GraphQLString
    },
    assetNum: {
        type: graphql.GraphQLString
    },
    addressNum: {
        type: graphql.GraphQLString
    },
    transactionNum: {
        type: graphql.GraphQLString
    },
  }
})

export { system }

