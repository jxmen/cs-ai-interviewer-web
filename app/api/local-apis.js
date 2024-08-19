const fetchLogOut = async () => {
  await fetch('/api/logout', { method: 'POST' })
}

const fetchIsLoggedIn = async () => {
  const response = await fetch('/api/isLoggedIn', { method: 'GET' })

  return await response.json()
}

export {
  fetchLogOut,
  fetchIsLoggedIn,
}
