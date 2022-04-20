const options = {
  origin: [
    'http://localhost:3001',
    'http://51.250.0.11',
    'http://movie-list.nomoredomains.xyz',
    'https://movie-list.nomoredomains.xyz',
    'http://api.nomoreparties.co/beatfilm-movies',
    'https://api.nomoreparties.co/beatfilm-movies',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = options;
