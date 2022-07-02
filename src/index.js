import { Router } from 'itty-router'

// now let's create a router (note the lack of "new")
const router = Router()
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-type': 'application/json',
};

// GET default data
router.get('/', request => new Response('{"error": "Missing request params"}', {headers}))

// GET collection index
router.get('/games', async request => {
  const games = await BOTC_DATA.get('games_metadata', {type: "json"})
  return new Response(JSON.stringify(games),{headers})
})

// GET item
router.get('/game/:id', async ({ params }) => {
  const game = await BOTC_DATA.get(params.id, {type:"json", cacheTtl: 60})
  return new Response(JSON.stringify(game),{headers})
})

// POST to the collection (we'll use async here)
/*router.post('/creategame', async request => {
  const content = await request.json()
  const slug = JSON.stringify(content.date)
  BOTC_DATA.put(slug.replace(/"/g, ""), JSON.stringify(content))

  return new Response('Created Game: ' + JSON.stringify(content))
})*/

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }))

// attach the router "handle" to the event handler
addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request))
)