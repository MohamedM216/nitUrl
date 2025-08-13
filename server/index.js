require('dotenv').config();
const express = require('express');
const path = require('path');
const { process } = require('process');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const urlRoutes = require('./shortner/shortener.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

app.use('/', urlRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


app.get('/health', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Hello from the backend!',
  });
});

app.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}`);
})