const moduleConcat = require('module-concat')

const outputFile = './server.js'

moduleConcat(
  './scripts/start.js',
  outputFile,
  {
    excludeNodeModules: ['ejs', 'webpack', 'webpack-dev-server'],
    excludeFiles: ['./configs/webpack.standalone.config']
  },
  (error, stats) => {
    if (error) {
      throw error
    }
    console.log(`${stats.files.length} were combined into ${outputFile}`)
  }
)
