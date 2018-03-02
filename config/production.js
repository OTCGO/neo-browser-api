module.exports = {
  app: {
    host: '0.0.0.0', // host
    port: '5001', // port
    apiPrefix: '/api/v1' // api 前缀
  },
  rpc: 'http://127.0.0.1:10332',
  network: 'mainnet',
  dbGlobal: {
    options: {
      host: '127.0.0.1',
      user: '',
      pass: ''
    },
    isAuthSource: 'admin',
    db: 'neo-main'
  }
}
