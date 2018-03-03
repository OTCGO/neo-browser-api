module.exports = {
  app: {
    host: '0.0.0.0', // host
    port: '5001', // port
    apiPrefix: '/api/v1' // api 前缀
  },
  rpc: process.env.RPC,
  network: process.env.NETWORK,
  dbGlobal: {
    options: {
      host: process.env.HOST
    },
    db: process.env.DB
  },
  log: {
    appenders: [ // 日志
      {
        type: 'console'
      }, // 控制台输出
      {
        type: 'file',
        filename: 'logs/http.log',
        maxLogSize: 20480,
        backups: 1,
        category: 'http',
        layout: {
          type: 'json',
          separator: ','
        }
      },
      {
        type: 'file',
        filename: 'logs/db.log',
        maxLogSize: 52428800,
        backups: 2,
        category: 'db',
        layout: {
          type: 'json',
          separator: ','
        }
      },
      {
        type: 'file',
        filename: 'logs/init.log',
        maxLogSize: 20480,
        backups: 1,
        category: 'init',
        layout: {
          type: 'json',
          separator: ','
        }
      },
      {
        type: 'file',
        filename: 'logs/mainnet.log',
        maxLogSize: 52428800,
        backups: 2,
        category: 'mainnet',
        layout: {
          type: 'json',
          separator: ','
        }
      }
    ]
  }
}
