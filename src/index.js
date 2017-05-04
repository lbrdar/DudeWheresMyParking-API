import app from './app';
import config from './config/environment';

app.listen(config.port, () => console.log(`Listening on port ${config.port}`)); // eslint-disable-line no-console