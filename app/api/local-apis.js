const fetchLogOut = async () => {
  await fetch('/api/logout', { method: 'POST' })
}

export {
  fetchLogOut
}
