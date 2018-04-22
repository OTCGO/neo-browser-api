import { api } from '@cityofzion/neon-js'

async function main () {
  const balances = await api.nep5.getTokenBalance('http://seed3.cityofzion.io:8080', 'acbc532904b6b51b5ea6d19b803d78af70e7e6f9', 'AQ8X2sKK26nuVzEPaMc3xUFZHgF3oprqVD')
  console.log('balances', balances)
  // const result = await api.nep5.getTokenInfo('http://seed3.cityofzion.io:8080', `0ec5712e0f7c63e4b0fea31029a28cea5e9d551f`)
  // console.log('result', result)
}

main()
