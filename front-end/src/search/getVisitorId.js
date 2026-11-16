// A random id for this browser, so the back end keeps this browser's recent
// searches apart from everyone else's. It is made once and saved in the
// browser, so it stays the same after a refresh.
function getVisitorId() {
  let visitorId = localStorage.getItem('curbcutVisitorId')

  if (!visitorId) {
    visitorId = crypto.randomUUID()
    localStorage.setItem('curbcutVisitorId', visitorId)
  }

  return visitorId
}

export default getVisitorId
