import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(request, response) {
    (async () => {
      if (redisClient.isAlive() && dbClient.isAlive()) {
        response.status(200).send(`{"redis": ${redisClient.isAlive()}, "db": ${dbClient.isAlive()}}`);
      }
    })();
  }

  static getStats(request, response) {
    const getUsers = () => new Promise((resolve) => {
      setTimeout(() => resolve(dbClient.nbUsers()), 1000);
    });
    const getFiles = () => new Promise((resolve) => {
      setTimeout(() => resolve(dbClient.nbFiles()), 1000);
    });

    (async () => {
      const [users, files] = await Promise.all([getUsers(), getFiles()]);
      response.status(200).send(`{"users": ${users}, "files": ${files}}`);
    })();
  }
}

export default AppController;
module.exports = AppController;
