import * as dotenv from 'dotenv'
dotenv.config()

import { api } from '@cityofzion/neon-js'

async function main () {
  // const balances = await api.nep5.getTokenBalance('http://seed3.cityofzion.io:8080', 'fd48828f107f400c1ae595366f301842886ec573', 'AGwJpXGPowiJfMFAdnrdB1uV92i4ubPANA')
  // console.log('balances', balances)
  const result = await api.nep5.getTokenInfo('http://114.215.30.71:10332', `01bafeeafe62e651efc3a530fde170cf2f7b09bd`)
  console.log('result', result)
}

main()
