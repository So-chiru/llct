var karaokePlayerListen = []
var carRAFHolder = null
var contentLoadKara = () => {
  if (carRAFHolder) {
    carRAFHolder = requestAnimationFrame(contentLoadKara)
  }
  var listenLen = karaokePlayerListen.length
  for (var i = 0; i < listenLen; i++) {
    if (!karaokePlayerListen[i][0].paused) {
      karaokePlayerListen[i][1].AudioSync(
        karaokePlayerListen[i][0].currentTime * 100,
        true
      )
    }
  }
}

var plLists = [
  ['yohane_player', 'karaoke_tsushima', 'yoshiko'],
  ['ruby_player', 'karaoke_kuroruby', 'ruby']
]
var loadKaraoke = () => {
  for (var k = 0; k < plLists.length; k++) {
    var a = document.getElementById(plLists[k][0])
    var ka = new Karaoke(document.getElementById(plLists[k][1]))
    ka.SetTimelineData(allResponseKaraoke[plLists[k][2]].timeline)

    Sakurauchi.listen(
      ['seeking', 'seeked'],
      () => {
        ka.clearSync(() => {
          ka.AudioSync(Math.floor(a.currentTime * 100), true)
        })
      },
      a
    )

    karaokePlayerListen.push([a, ka])
  }

  carRAFHolder = requestAnimationFrame(contentLoadKara)
}

Sakurauchi.listen('DOMContentLoaded', () => {
  if (dataYosoro.get('tatenshi')) document.body.classList.add('dark')
  document.getElementById('curt').classList.add('hide_curtain')

  $.ajax({
    url: './data/car/all.json',
    success: d => {
      if (typeof d !== 'object') {
        return logger(
          0,
          'r',
          'Received karaoke json data is not valid object.',
          'e'
        )
      }
      try {
        window.allResponseKaraoke = d
        Sakurauchi.run('KaraokeLoaded')
        logger(0, 'r', 'Karaoke Data Loaded: Server Auto Load', 'i')

        loadKaraoke()
      } catch (e) {
        console.log(e)
        logger(0, 'r', 'Failed to load karaoke data.', 'e')
      }
    }
  })
})
