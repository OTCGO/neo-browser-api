import {  client as redis } from '../../lib'


async function main() {
    // const list = await redis.zrevrange('0c092117b4ba47b81001712425e6e7f760a637695eaf23741ba335925b195ecd', 0, 2, 'WITHSCORES')
    // console.log('list', list)

    redis.zadd(`${333}`, 111, 'address')
    redis.expire(`${333}`, 60)

}

main()