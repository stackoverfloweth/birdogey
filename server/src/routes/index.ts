import { Hono } from 'hono'
import { auth } from './auth.js'
import { events } from './events.js'
import { imagekit } from './imagekit.js'
import { seasons } from './seasons.js'
import { users } from './users.js'
import { recaptcha } from './recaptcha.js'

const routes = new Hono()

routes.route('/auth', auth)
routes.route('/events', events)
routes.route('/imagekit', imagekit)
routes.route('/seasons', seasons)
routes.route('/users', users)
routes.route('/recaptcha', recaptcha)

export { routes }
