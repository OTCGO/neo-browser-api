import * as dotenv from 'dotenv'
dotenv.config()


import gb from '../../constant/global'

import { getAccountState } from '../../services'


async function main() {

    try {


        const neoResult: any = await getAccountState('ARWFDZW4s9RZvTFjpXDo6wwb3VEp48qFhf')

        const result = []
        neoResult.result.balances.forEach(element => {
            result.push({
                assetId: element.asset,
                name: gb[element.asset],
                type: 'Global',
                balances: `${element.value || 0}`
            }
            )
        });

        


       
       
        console.log('global', gb)

        console.log('neoResult', neoResult)

        console.log('result', result)
    } catch (error) {
        console.log('error', error)
    }
}


main()