import dbClient from "../utils/db";
import { v4 as uuidv4 } from 'uuid';
import redisClient from "../utils/redis";
const { ObjectId } = require('mongodb');

class AuthController {
  static async getConnect(request, response) {
    const headerAuth = request.headers['authorization'];
    if (headerAuth.startsWith('Basic ')) {
      const authEncoded = headerAuth.slice(6);
      const authDecoded = atob(authEncoded);

      const [email, password] = authDecoded.split(':');
      const hashedPassword = sha1(password);
      try {
        const users = dbClient.db.collection('users');
        const userExist = await users.findOne({ email, hashedPassword }).toArray();
        if (!userExist) {
          response.status(401).send({error: "Unauthorized"});
        } else {
          const token = uuidv4();
          const authKey = `auth_${token}`;
          await redisClient.set(authKey, userExist._id.toString(), 86400);
          response.status(200).send({ "token": token });
        }
      } catch (err) {
        response.status(500).send({error: "server error"});
      }
    }
  }

  static async getDisconnect(request, response) {
    const headerToken = request.headers['x-token'];
    const authKey = `auth_${headerToken}`;
    const userId = await redisClient.get(authKey);
    try {
      const users = dbClient.db.collection('users');
      const userExist = await users.findOne({ _id: new ObjectId(userId) });
      if (userExist) {
        await redisClient.del(authKey);
        response.status(204).send({});
      } else {
        response.status(401).send({error: "Unauthorised"});
      }
    } catch (err) {
      response.status(500).send({error: "Server issue"});
    }
  }
}

export default AuthController;
module.exports = AuthController;