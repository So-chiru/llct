/* global $, Karaoke, urlQueryParams, karaokeData */

$(document).ready(() => {
  var audioPlayer = document.getElementById('kara_audio')
  audioPlayer.src =
    (urlQueryParams('local') !== null ? './' : '//cdn.lovelivec.kr/') +
    'data/' +
    urlQueryParams('id') +
    '/audio.mp3'
  audioPlayer.volume = 0.5

  $('.bg_img').attr(
    'src',
    (urlQueryParams('local') !== null ? './' : '//cdn.lovelivec.kr/') +
      'data/' +
      urlQueryParams('id') +
      '/bg.png'
  )
  $('.bg_img').addClass('loadedImage')

  window.audioSyncRefresh = setInterval(function () {
    if (audioPlayer.paused) return 0
    Karaoke.AudioSync(Math.floor(audioPlayer.currentTime * 100), false)
  }, 5)

  audioPlayer.addEventListener('seeking', e => {
    Karaoke.clearSync(function () {
      Karaoke.AudioSync(Math.floor(audioPlayer.currentTime * 100), true)
    })
  })

  audioPlayer.addEventListener('seeked', e => {
    Karaoke.clearSync(function () {
      Karaoke.AudioSync(Math.floor(audioPlayer.currentTime * 100), true)
    })
  })

  window.addEventListener('keydown', e => {
    var prevent = false
    switch (e.keyCode) {
      case 32:
        prevent = true
        audioPlayer[audioPlayer.paused ? 'play' : 'pause']()
        break
      case 37:
        prevent = true
        audioPlayer.currentTime =
          audioPlayer.currentTime - 5 < 0 ? 0 : audioPlayer.currentTime - 5
        break
      case 39:
        prevent = true
        audioPlayer.currentTime =
          audioPlayer.currentTime + 5 > audioPlayer.duration
            ? audioPlayer.currentTime +
              (audioPlayer.duration - audioPlayer.currentTime) / 2
            : audioPlayer.currentTime + 5
        break
      default:
        break
    }

    if (prevent) {
      e.preventDefault()
      return 0
    }
  })

  $.ajax({
    url:
      (urlQueryParams('local') !== null ? './' : '//cdn.lovelivec.kr/') +
      'data/' +
      urlQueryParams('id') +
      '/karaoke.json',
    success: function (data) {
      window.karaokeData = typeof data === 'object' ? data : JSON.parse(data)

      $('#title_text').html(karaokeData.metadata.title || '무제')
      $('#blade_color').html(karaokeData.metadata.bladeColorMember || '자유')
      document.title = karaokeData.metadata.title || '무제'

      var _hx = karaokeData.metadata.bladeColorHEX

      if (_hx !== null && _hx !== 'null' && _hx !== '#000000' && _hx !== '') {
        document.getElementById('blade_color').style.color = _hx
      }

      Karaoke.RenderDOM()
    },
    error: function (err) {
      console.error(err)
    }
  })

  window.addEventListener('KaraokeSelection', function (e) {
    audioPlayer.currentTime =
      karaokeData.timeline[e.detail.posX].collection[e.detail.posY].start_time /
        100 -
      0.03
  })
})
