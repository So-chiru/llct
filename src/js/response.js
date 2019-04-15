Sakurauchi.listen('DOMContentLoaded', () => {
  if (dataYosoro.get('tatenshi')) document.body.classList.add('dark')

  document.getElementById('curt').classList.add('hide_curtain')
})
