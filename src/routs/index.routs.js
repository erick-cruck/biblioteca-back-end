const user = require('./user.routs');
const librera = require('./librera.routs');

const routes = (app) => {
  app.use('/user', user);
  app.use('/librera', librera);
};

module.exports = routes;
