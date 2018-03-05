/**
 * Filename: /Users/wei/Desktop/otcgo/neo_scrapy/src/utils/request.ts
 * Path: /Users/wei/Desktop/otcgo/neo_scrapy
 * Created Date: Thursday, November 16th 2017, 12:01:49 am
 * Author: wei
 *
 * Copyright (c) 2017 Your Company
 */

import { parallelLimit } from 'async'


const parallel = (task, limit) => {
    return new Promise<string>((resolve, reject) => {
        parallelLimit(task, limit, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })

    })
}



export { parallel }