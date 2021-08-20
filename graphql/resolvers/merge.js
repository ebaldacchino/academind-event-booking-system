const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
	return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
	return User.find({ _id: { $in: userIds } });
});

const events = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		events.sort(
			(a, b) =>
				eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
		);
		return events.map((event) => transformEvent(event));
	} catch (err) {
		throw err;
	}
};
const singleEvent = async (eventId) => {
	try {
		return await eventLoader.load(eventId.toString());
	} catch (err) {
		throw err;
	}
};
const transformEvent = ({ _doc, id }) => {
	return {
		..._doc,
		_id: id,
		date: dateToString(_doc.date),
		creator: user.bind(this, _doc.creator),
	};
};
const transformBooking = ({ id, _doc }) => {
	return {
		..._doc,
		_id: id,
		user: user.bind(this, _doc.user),
		event: singleEvent.bind(this, _doc.event),
		createdAt: dateToString(_doc.createdAt),
		updatedAt: dateToString(_doc.updatedAt),
	};
};
const user = async (userId) => {
	try {
		const { _doc, id } = await userLoader.load(userId.toString());

		return {
			..._doc,
			_id: id,
			createdEvents: () => eventLoader.loadMany(_doc.createdEvents),
		};
	} catch (err) {
		throw err;
	}
};

module.exports = {
	singleEvent,
	transformEvent,
	transformBooking,
	user,
};
