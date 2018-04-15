import {  client as redis } from '../../lib'


async function main() {
    const list = await redis.zrevrange('f8d135a5765903f0a6b6989ecce509efd9bffc4b', 0, 1)
    console.log('list', list)

}

main()