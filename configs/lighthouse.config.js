module.exports = {
  extends: 'lighthouse:default',
  settings: {
    skipAudits: ['redirects-http', 'uses-http2'] // localhost does not need https or http/2 check
  }
}
