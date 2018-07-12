
const request = require('request')
import * as config from 'config'



const getOntBalance = async (address) => {

    const options = {
        method: 'GET',
        url: `${config.get('neoAPI')}/${config.get('network')}/address/${address}`,
    }

    return new Promise<string>((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) return reject(error)
            return resolve(JSON.parse(body))
        })
    })



}




export { getOntBalance }