const options = {
  origin: [
    'http://localhost:3001',
    'http://51.250.7.57',
    'http://movie-list.nomoredomains.rocks',
    'https://movie-list.nomoredomains.rocks',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = options;
