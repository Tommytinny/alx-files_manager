import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email) response.status(400).json({ error: 'Missing email' });
    if (!password) response.status(400).json({ error: 'Missing password' });

    await dbClient.client.connect();
    const users = dbClient.db.collection('users');
    const userExist = await users.find({ email });
    if (userExist) {
      response.status(400).json({ error: 'Already exist' });
    } else {
      const hashedPassword = sha1(password);
      const result = await users.insertOne({ email, password: hashedPassword });
      response.status(201).json({ id: result.insertedId, email });
    }
  }

  static async getMe(request, response) {
    const headerToken = request.headers['x-token'];
    if (!headerToken) response.status(401).json({ error: 'Unauthorized' });
    const authKey = `auth_${headerToken}`;
    const userId = await redisClient.get(authKey);
    if (!userId) response.status(401).json({ error: 'Unauthorized' });
    const users = dbClient.db.collection('users');
    const userExist = await users.findOne({ _id: new ObjectId(userId) });
    if (userExist) {
      response.status(200).send({ id: userExist._id, email: userExist.email });
    } else {
      response.status(401).json({ error: 'Unauthorised' });
    }
  }
}

export default UsersController;
module.exports = UsersController;
