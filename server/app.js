import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './middleware/swagger';

import router from './routes/routes';

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/api/v1', router);
app.get('*', (req, res) => res.status(200).json({
  message: 'WELCOME TO WayFarer',
  documentation: 'https://wayfarer0.herokuapp.com/docs',
}));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.set('port', port);
app.listen(port, console.log(`listening to ${port}`));
export default app;
