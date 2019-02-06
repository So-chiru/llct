/* global PhotoSwipe, PhotoSwipeUI_Default, history, location, LazyLoad $ */

var callObject = {}

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

var callTableCaching = function () {
  $.ajax({
    url: './data/lists.json',
    success: function (data) {
      callObject = data
      searchRefresh(callObject)
    },
    error: function (err) {
      console.error(err)
    }
  })
}

var searchFiltering = function (filter, bypassHistory) {
  if (!bypassHistory) {
    history.pushState({ data: filter }, filter + ' 검색 결과', '/?f=' + filter)
  }

  filter = filter.toLowerCase().replace(/\s/g, '')
  var finalObj = {}
  var scoreObj = {}
  Object.keys(callObject).forEach(function (_a, _ai) {
    var a = Object.values(callObject[_a])

    scoreObj[_a] = 0
    if (_a === filter) scoreObj[_a] += 100
    if (_a.indexOf(filter) !== -1) scoreObj[_a] += 10

    a.forEach(function (b) {
      if (typeof b !== 'string') return 0
      if (Array.isArray(b)) {
        b.forEach(function (c, d) {
          c = c.toLowerCase().replace(/\s/g, '')
          if (c.toLowerCase() === filter) scoreObj[_a] += 100
          if (c.toLowerCase().indexOf(filter) !== -1) scoreObj[_a] += 10
        })
        return 0
      }

      b = b.toLowerCase().replace(/\s/g, '')

      if (b === filter) scoreObj[_a] += 100
      if (b.indexOf(filter) !== -1) scoreObj[_a] += 10
    })
  })

  Object.entries(scoreObj).forEach(function (k) {
    if (k[1] <= 1) return 0
    finalObj[k[0]] = callObject[k[0]]
  })

  searchRefresh(finalObj)
}

var clearSearch = function () {
  $('#search_box').val('')
  history.pushState({ data: '' }, 'LLCT', '/')

  searchRefresh(callObject)
}

var showDetailsW = function (id, isKaraoke) {
  var pswpElement = document.querySelectorAll('.pswp')[0]

  if (typeof isKaraoke === 'boolean' && isKaraoke) {
    location.href = '/karaoke.html?id=' + id
    return 0
  }

  var items = [
    {
      src: 'https://cdn.lovelivec.kr/data/' + id + '/call.jpg',
      w: 3505,
      h: 2480
    }
  ]

  var options = {
    index: 0,
    showHideOpacity: true,
    history: false,
    closeOnScroll: false,
    passive: false
  }

  var gallery = new PhotoSwipe(
    pswpElement,
    PhotoSwipeUI_Default,
    items,
    options
  )
  gallery.init()
}

window.addEventListener('popstate', function () {
  if (typeof history.state.data !== 'undefined') {
    searchFiltering(history.state.data, true)
  }
})

var searchRefresh = function (obj) {
  var keys = Object.keys(obj)

  $('#search_rest').html('')

  keys.forEach(function (dataTitle, i) {
    var datobj = obj[dataTitle]
    var baseElement = $(
      '<div class="music_ele" onclick="showDetailsW(\'' +
        datobj.id +
        "', " +
        (datobj.karaoke || false) +
        ')"> ' +
        (cookieYosoro.get('sakana') === 'false'
          ? '<img class="card_bg lazy" data-src="https://cdn.lovelivec.kr/data/' +
            datobj.id +
            '/bg.png" onerror="this.style.display = \'none\'"></img>'
          : '') +
        ' </div>'
    )
    var cardContent = $('<div class="card_content"></div>')

    var title = $(
      '<h1 class="' +
        ($('#showAs_translated').is(':checked') ? 'kr' : 'jp') +
        ' scTitle"></h1>'
    )
    title.html(
      cookieYosoro.get('mikan') === 'true'
        ? datobj.translated || dataTitle
        : dataTitle
    )
    cardContent.append(title)

    baseElement.append(cardContent)
    $('#search_rest').append(baseElement)

    setTimeout(function () {
      baseElement.css('opacity', '1')
    }, 35 * i)
  })

  if (keys.length < 1) {
    $('#search_rest').html('<h3>검색 결과가 없습니다.</h3>')
  }

  window.imgLazyLoad = new LazyLoad({
    elements_selector: '.lazy'
  })
}

callTableCaching()

var optionObjects = [
  {
    e: '#showAs_translated',
    cn: 'mikan',
    rf: true
  },
  {
    e: '#hideBGImage',
    cn: 'sakana',
    rf: true
  },
  {
    e: '#enable_darkMode',
    cn: 'tatenshi',
    rf: false,
    cb: value => {
      $(document.body)[value === 'true' ? 'addClass' : 'removeClass']('dark')
    }
  }
]
const changedOption = id => {
  cookieYosoro.set(optionObjects[id].cn, $(optionObjects[id].e).is(':checked'))
  if (optionObjects[id].rf) searchFiltering(urlQueryParams('f'), true)
  if (typeof optionObjects[id].cb === 'function') {
    optionObjects[id].cb(cookieYosoro.get(optionObjects[id].cn))
  }
}

var urlQueryParams = function (name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(location.search)
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

$(document).ready(function () {
  optionObjects.forEach(obj => {
    if (typeof cookieYosoro.get(obj.cn) === 'undefined') {
      cookieYosoro.set(obj.cn, false)
    }
    $(obj.e).prop('checked', cookieYosoro.get(obj.cn) === 'true')
  })

  if (urlQueryParams('f') !== '') {
    searchFiltering(urlQueryParams('f'), true)
  }

  window.imgLazyLoad = new LazyLoad({
    elements_selector: '.lazy'
  })
})
