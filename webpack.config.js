const path = require('path');

module.exports = {
  target: 'webworker',
  mode: 'production',
  entry: './worker.js',
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
  },
  performance: {
    hints: false,
  },
  // Résoudre les polyfills pour l'environnement Cloudflare Workers
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
    },
  },
}; 