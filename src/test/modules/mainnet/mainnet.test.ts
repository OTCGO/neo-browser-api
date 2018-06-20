import { api } from '@cityofzion/neon-js'

async function main () {
  // const balances = await api.nep5.getTokenBalance('http://seed3.cityofzion.io:8080', 'acbc532904b6b51b5ea6d19b803d78af70e7e6f9', 'AQ8X2sKK26nuVzEPaMc3xUFZHgF3oprqVD')
  // console.log('balances', balances)
  const result = await api.nep5.getTokenInfo('http://114.215.30.71:10332', `a87cc2a513f5d8b4a42432343687c2127c60bc3f`)
  console.log('result', result)
}

main()
