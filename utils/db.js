const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    this.connected = false;
    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri);
    this.client
      .connect()
      .then(() => {
        this.db = this.client.db(database);
        this.connected = true;
      })
      .catch(() => {
        this.db = null;
        this.connected = false;
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    await this.client.connect();
    const users = this.db.collection('users');
    const nUsers = await users.countDocuments();
    return nUsers;
  }

  async nbFiles() {
    await this.client.connect();
    const files = this.db.collection('files');
    const nFiles = await files.countDocuments();
    return nFiles;
  }
}

const dbClient = new DBClient();
export default dbClient;
