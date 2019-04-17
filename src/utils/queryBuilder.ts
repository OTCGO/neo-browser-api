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
    // delete args.skip
    // delete args.limit

    const tem = Object.create(args)
    delete tem.skip
    delete tem.limit

    return  {...query, ...tem}
  }

  export { queryBuilder }