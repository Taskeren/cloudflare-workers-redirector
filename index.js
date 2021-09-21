const mappingsUrl = "https://gist.githubusercontent.com/Taskeren/4b5f0c09b9de0fc882c614a1881c2715/raw/cf_worker_redirector.json"

const builtIn = {
  // Homepage
  "/": "https://github.com/Taskeren/cloudflare-workers-redirector",
  "/mappings": mappingsUrl
}

async function handleRequest(request) {
  let url = new URL(request.url)
  let { pathname, search } = url

  let gist = await fetch(mappingsUrl)
  let data = await gist.json()

  let table = {}
  for (key in data) {
    table[key] = data[key]
  }
  for (key in builtIn) {
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
  if (debugMode) {
    return new Response(debugInfo)
  } else {
    if (url) {
      return Response.redirect(url, 302)
    } else {
      return new Response(generateErrorPage(requested, url, redirectMap, mappingsUrl), {
        headers: {
          "content-type": "text/html"
        }
      })
      // return new Response(`Your resource is unreachable!\n${debugInfo}`)
    }
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function generateErrorPage(untransformed, transformed, mappings, mappingUrl) {
  return `

  <!DOCTYPE html>
  <html lang="zh-cmn-Hans">
  <head>
      <meta charset="UTF-8">
      <title>404 Oops!</title>
      <meta name="viewport" content="width=device-width, maximum-scale=1, initial-scale=1"/>
      <style>
          html, body{
              height: 100%;
          }
  
          body{
              color: #333;
              margin: auto;
              padding: 1em;
              display: table;
              user-select: none;
              box-sizing: border-box;
              font: lighter 20px "微软雅黑";
          }
          a{
              color: #3498db;
              text-decoration: none;
          }
          h1{
              margin-top: 0;
              font-size: 3.5em;
          }
          main{
              margin: 0 auto;
              text-align: center;
              display: table-cell;
              vertical-align: middle;
          }
  
          .btn{
              color: #fff;
              padding: .75em 1em;
              background: #3498db;
              border-radius: 1.5em;
              display: inline-block;
              transition: opacity .3s, transform .3s;
          }
          .btn:hover{
              transform: scale(1.1);
          }
          .btn:active{
              opacity: .7;
          }
  
          .debug-info {
              display: none;
              font: normal .2em "微软雅黑";
          }
      </style>
  </head>
  <body>
  <main>
      <h1>:'(</h1>
      <p>找不到您正在请求的链接！</p>
      <p>请核实后再尝试，或联系服务器管理员。</p>
      <a class="debug btn" href="#">除错信息</a>
      <span class="debug-info">
          <fieldset>
              <label>请求资源 <input type="text" id="debugUntransformed" value="${untransformed}"></label>
              <label>解析资源 <input type="text" id="debugTransformed" value="${transformed}"></label>
              <label>映射表资源 <input type="text" id="debugMappingUrl" value="${mappingUrl}"></label>

              <table>
                <tbody id="debugMappings">
                  ${generateMappingsTable(mappings)}
                </tbody>
              </table>
          </fieldset>
      </span>
  </main>
  </body>
  <script>
      document.getElementsByClassName('debug')[0].addEventListener('click', event => {
        document.getElementsByClassName('debug')[0].style.display = 'none'
          document.getElementsByClassName('debug-info')[0].style.display = 'block'
      })
  </script>
  </html>
`
}

function generateMappingsTable(mappings) {
  let result = ""
  for(const [untransformed, transformed] of Object.entries(mappings)) {
    result += `<tr><td>${untransformed}</td><td>${transformed}</td></tr>`
  }
  return result
}