import { api } from '@cityofzion/neon-js'

async function main () {
  const balances = await api.nep5.getTokenBalance('http://api.otcgo.cn:10332', 'a0b328c01eac8b12b0f8a4fe93645d18fb3f1f0a', 'AewZoQE4oTc81MJx2RBGhmNSeEURvPVhyn')
  console.log('balances', balances)
}

main()
