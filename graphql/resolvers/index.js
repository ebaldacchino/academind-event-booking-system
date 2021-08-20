const authResolver = require('./auth');
const bookingResolver = require('./booking');
const eventsResolver = require('./events');

module.exports = {
	...authResolver,
	...bookingResolver,
	...eventsResolver,
};
