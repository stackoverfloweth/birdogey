import { Hono } from 'hono'
import { auth } from './auth.js'
import { events } from './events.js'
import { imagekit } from './imagekit.js'
import { players } from './players.js'
import { recaptcha } from './recaptcha.js'

const routes = new Hono()

routes.route('/auth', auth)
routes.route('/events', events)
routes.route('/imagekit', imagekit)
routes.route('/players', players)
routes.route('/recaptcha', recaptcha)

export { routes }
