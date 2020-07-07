const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
if (app.get('env') === 'development') app.use(morgan('dev'));
app.set('view engine', 'pug');

// Routing
app.use(express.static('./public'));
app.get('/', (req, res) => {
	return res.render('landing');
});

// Launch Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
	console.log(`
Server running on PORT ${PORT}...
Website live at http://localhost:${PORT}/
`)
);
