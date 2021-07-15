const mappingsUrl = "https://gist.githubusercontent.com/nitu2003/4b5f0c09b9de0fc882c614a1881c2715/raw/cf_worker_redirector.json"

const builtIn = {
  // Homepage
  "/": "https://github.com/nitu2003/cloudflare-workers-redirector",
  "/mappings": mappingsUrl
}

async function handleRequest(request) {
  let url = new URL(request.url)
  let { pathname, search } = url

  let gist = await fetch(mappingsUrl)
  let data = await gist.json()

  let table = {}
  for(key in data) {
    table[key] = data[key]
  }
  for(key in builtIn) {
    table[key] = builtIn[key]
  }

  let resId = pathname
  let debugMode = search && search == "?debug"

  return redirectOrThrow(resId, table, debugMode)
}

async function redirectOrThrow(requested, redirectMap, debugMode) {
  let url = redirectMap[`${requested}`]
  let debugInfo = `---=== Debug Information ===---
  Resource ID:         ${requested}
  Resource Link:       ${url}
  Resource Table:      ${JSON.stringify(redirectMap)}
  Resource Table Link: ${mappingsUrl}`
  if(debugMode) {
    return new Response(debugInfo)
  } else {
    if(url) {
      return Response.redirect(url, 302)
    } else {
      return new Response(`Your resource is unreachable!\n${debugInfo}`)
    }
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
