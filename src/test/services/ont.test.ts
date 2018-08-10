import * as dotenv from 'dotenv'
dotenv.config()


import { getOntBalance } from '../../services'

const ONT_HASH = '0000000000000000000000000000000000000001'
const ONG_HASH = '0000000000000000000000000000000000000002'

async function main() {

    try {


        const ontResult: any = await getOntBalance('AZ2FJDreaBA9v4YzxsNPnkcvir1Jh3SdoG')


        // console.log('ontResult', typeof ontResult)
        // console.log('ontResult', ontResult._id)
       // console.log('ontResult', ontResult.balances)
        const result = []
        // ONT_HASH
        result.push({
            assetId: ONT_HASH,
            name: 'ontology-ONT',
            type: 'ont',
            balances: `${ontResult[ONT_HASH] || 0}`
        }
        )

        // ONG_HASH
        result.push({
            assetId: ONG_HASH,
            name: 'ontology-ONG',
            type: 'ont',
            balances: `${ontResult[ONG_HASH] || 0}`
        }
        )

        console.log('result', result)
    } catch (error) {
        console.log('error', error)
    }
}


main()