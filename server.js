const mongoose = require('mongoose');
const app = require('express')();

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zlqva.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		const port = process.env.PORT || 3000;
		app.listen(port, () => {
			console.log(`Server listening on port : ${port}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
