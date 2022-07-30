import { Router } from 'itty-router'

// now let's create a router (note the lack of "new")
const router = Router()
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-type': 'application/json',
};

// Check if we got JSON response
function isJsonObject(strData) {
  try {
    JSON.parse(strData)
  } catch (e) {
    return false
  }
  return true
}

// GET default data
router.get('/', request => new Response('{"error": "Missing request params"}', {headers}))

// GET collection index
router.get('/games', async request => {
  //const games = await BOTC_DATA.get('games_metadata', {type: "json"})
  //return new Response(JSON.stringify(games),{headers})
  const init = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  }
  const metaData = await fetch('https://raw.githubusercontent.com/hack13/neos-boct-scripts/main/games.json', init)
  return new Response(JSON.stringify(await metaData.json()), {headers})
})

// GET item
router.get('/game/:id', async ({ params }) => {
  //const game = await BOTC_DATA.get(params.id, {type:"json", cacheTtl: 60})
  //return new Response(JSON.stringify(game),{headers})
  let url = 'https://raw.githubusercontent.com/hack13/neos-boct-scripts/main/games/'+params.id+'.json'
  const init = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  }
  const metaData = await fetch(url, init)
  let gatheredData = await metaData.json().catch(err => {console.error(err)});

  if (gatheredData != null) {
    return new Response(JSON.stringify(gatheredData),{headers})
  } else {
    let missingGame = {'error' : 'Game Not Found'}
    return new Response(JSON.stringify(missingGame),{headers})
  }
  
})

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }))

// attach the router "handle" to the event handler
addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request))
)