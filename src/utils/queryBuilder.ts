import { object } from 'joi'

/**
 * Filename: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server/src/utils/queryBuilder.ts
 * Path: /Users/wei/Desktop/otcgo/neo_wallet_analysis/web-server
 * Created Date: Thursday, November 23rd 2017, 7:33:06 pm
 * Author: qknow
 *
 * Copyright (c) 2017 otcgo.cn
 */

const queryBuilder = (query, args) => {

  const tem = Object.assign({}, args)

  delete tem.skip
  delete tem.limit


  return { ...query, ...tem }
}

export { queryBuilder }