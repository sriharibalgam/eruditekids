const host = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || 27017;
const database = process.env.MONGO_NAME || 'eruditekids';
const password = process.env.MONGO_PASSWORD || '';
const username = process.env.MONGO_USER || '';
const ssl = process.env.MONGO_SSL || false;
const credentials = username ? `${username}:${encodeURIComponent(password)}@` : '';
const environment = process.env.ENV_NAME || 'local';

// mongodb+srv://eruditekids:eruditekids@eruditekids.6mwrn.mongodb.net/
const serverDBUrl = `mongodb+srv://${credentials}${host}/${database}?retryWrites=true`;
const localDBUrl = `mongodb://${credentials}${host}:${mongoPort}/${database}?ssl=${ssl}`;

const dbConnection = {
  env: environment,
  host,
  dbUrl: (process.env.ENV_NAME || 'LOCAL') !== 'LOCAL' ? serverDBUrl : localDBUrl,
  options: {
    autoIndex: true
  }
};

export default dbConnection;
