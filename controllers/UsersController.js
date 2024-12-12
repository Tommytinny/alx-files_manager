import dbClient from "../utils/db";
import sha1 from 'sha1';
const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(request, response) {
    const email = request.body.email;
    const password = request.body.password;
    if (!email) {
        response.status(400).send({error: 'Missing email'});
    }
    if (!password){
        response.status(400).send({error: 'Missing password'});
    }
    try {
        const users = dbClient.db.collection('users');
        const userExist = await users.find({ email });
        if (userExist) {
            response.status(400).send({error: "Already exist"});
        } else {
            const hashedPassword = sha1(password);
            const result = await users.insertOne({ email, password: hashedPassword });
            response.status(201).send({"id": result.insertedId, "email": email});
        }
    } catch (err) {
        response.status(500).send({error: "Server error"});
    }
  }

  static async getMe(request, response) {
    const headerToken = request.headers['x-token'];
    if (!headerToken) response.status(401).send({ error: 'Unauthorized' });
    const authKey = `auth_${headerToken}`;
    const userId = await redisClient.get(authKey);
    if (!userId) response.status(401).send({ error: 'Unauthorized' })
    try {
      const users = dbClient.db.collection('users');
      const userExist = await users.findOne({ _id: new ObjectId(user_id) });
      if (userExist) {
        response.status(200).send({ id: userExist._id, email: userExist.email });
      } else {
        response.status(401).send({error: 'Unauthorised'});
      }
    } catch (err) {
        response.status(500).send({error: 'server error'});
    }
  }
}

export default UsersController;
module.exports = UsersController;