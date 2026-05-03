import { Hono } from 'hono'
import { auth } from './auth'
import { events } from './events'
import { imagekit } from './imagekit'
import { users } from './users'
import { recaptcha } from './recaptcha'

const routes = new Hono()

routes.route('/auth', auth)
routes.route('/events', events)
routes.route('/imagekit', imagekit)
routes.route('/users', users)
routes.route('/recaptcha', recaptcha)

export { routes }
