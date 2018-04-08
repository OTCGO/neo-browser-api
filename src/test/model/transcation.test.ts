import * as dotenv from 'dotenv'
dotenv.config()

import { DBClient } from '../../lib'
import * as config from 'config'
const dbUtxolClient: any = new DBClient(config.get('dbUtxo'))


async function main () {
    const dbUtxo = await dbUtxolClient.connection()
    const uxtos = await dbUtxo.utxos.aggregate([
       {
           $match: {
                spent_height: {$exists: false},
                // address: 'AUkVH4k8gPowAEpvQVAmNEkriX96CrKzk9'
            }
        }, {
            $group:  {
                _id : {
                    address: '$address',
                    asset: '$asset'
                },
                balance: {
                    $sum: '$value'
                }
            }
        }
    ]).toArray()

    console.log('uxtos', uxtos)
}

main()