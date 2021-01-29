const host = process.env.MONGO_HOST || 'localhost';
const mongoport = process.env.MONGO_PORT || 27017;
const database = process.env.MONGO_NAME || 'eruditekids';
const password = process.env.MONGO_PASSWORD || 'eruditekids';
const username = process.env.MONGO_USER || 'eruditekids';
const ssl = process.env.MONGO_SSL || false;
const credentials = username ? `${username}:${encodeURIComponent(password)}@` : '';
const poolSize = process.env.MONGO_POOL_SIZE ? parseInt(process.env.MONGO_POOL_SIZE, 10) : 100;
const environment = process.env.ENV_NAME || 'local';

// mongodb+srv://eruditekids:eruditekids@eruditekids.6mwrn.mongodb.net/
const serverDBUrl = `mongodb+srv://${credentials}${host}/${database}?retryWrites=true`;
const localDBUrl = `mongodb://${credentials}${host}:${mongoport}/${database}?ssl=${ssl}`

const dbConnection = {
  env: environment,
  host: host,
  dbUrl: (process.env.ENV_NAME || 'LOCAL') !== 'LOCAL' ? serverDBUrl : localDBUrl,
  options: {
    poolSize: poolSize,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
};

export default dbConnection;