/* global $, location */

var cookieYosoro = {
  get: function (key) {
    var cookies = document.cookie.split(';')
    var i

    for (i = 0; i < cookies.length; i++) {
      var x = cookies[i].substr(0, cookies[i].indexOf('='))
      var y = cookies[i].substr(cookies[i].indexOf('=') + 1)
      x = x.replace(/^\s+|\s+$/g, '')
      if (x === key) {
        return unescape(y)
      }
    }
  },

  set: function (key, value) {
    document.cookie = key + '=' + escape(value)
  },

  clear: function (key) {}
}

var urlQueryParams = function (name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(location.search)
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

$(document).ready(() => {
  if (cookieYosoro.get('tatenshi') === 'true') $(document.body).addClass('dark')
})
