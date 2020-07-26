const requireAll = r => r.keys().forEach(r)

require('./js/index')

require('./styles/index.scss')

requireAll(require.context('./styles/', true, /\.scss$/))