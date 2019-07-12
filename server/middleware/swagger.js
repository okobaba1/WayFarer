import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  info: {
    description: 'WayFarer is a public bus transportation booking server.',
    version: '1.0.0',
    title: 'WAYFARER',
  },
  host: 'wayfarer0.herokuapp.com/',
  basePath: 'api/v1',

  schemes: ['https', 'http'],
  consumes: ['application/json', 'application/x-www-form-urlencoded'],
  produces: ['application/json'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'x-access-token',
      in: 'header',
    },
  },
};


const options = {
  swaggerDefinition,
  apis: ['./docs/**/*.yaml'],
};


module.exports = swaggerJSDoc(options);
