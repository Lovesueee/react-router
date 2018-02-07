module.exports = {
  path: 'profile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      debugger;
      cb(null, require('./components/Profile'))
    })
  }
}
