export default {
  methods: {
    onceDocument (event, cb, useCapture) {
      var remover, wrapper
      remover = null
      wrapper = function (e) {
        if (cb(e)) {
          if (remover != null) {
            return remover()
          }
        }
      }
      document.documentElement.addEventListener(event, wrapper, useCapture)
      remover = function () {
        document.documentElement.removeEventListener(event, wrapper)
        remover = null
      }
      return remover
    },
    onDocument (event, cb, useCapture) {
      var remover
      document.documentElement.addEventListener(event, cb, useCapture)
      remover = function () {
        document.documentElement.removeEventListener(event, cb)
        remover = null
      }
      return remover
    }
  }
}
