const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
	bookings: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		try {
			const bookings = await Booking.find({ user: req.userId });

			return bookings.map((booking) => transformBooking(booking));
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async (args, req) => {
		const fetchedEvent = await Event.findOne({ _id: args.eventId });
		const booking = new Booking({
			user: req.userId,
			event: fetchedEvent,
		});
		const result = await booking.save();
		return transformBooking(result);
	},
	cancelBooking: async ({ bookingId }, { isAuth }) => {
		if (!isAuth) {
			throw new Error('Unauthenticated!');
		}
		try {
			const booking = await Booking.findById(bookingId).populate('event');

			const event = transformEvent(booking.event);

			await Booking.deleteOne({ _id: bookingId });

			return event;
		} catch (err) {
			throw err;
		}
	},
};
