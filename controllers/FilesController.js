import dbClient from "../utils/db";

class FilesController {
  static async postUpload(request, response) {
    const headerToken = request.headers['x-token'];
    if (!headerToken) response.status(401).send({ error: 'Unauthorized' });
    const authKey = `auth_${headerToken}`;
    const userId = await redisClient.get(authKey);
    if (!userId) response.status(401).send({ error: 'Unauthorized' });
    try {
      const users = dbClient.db.collection('users');
      const userExist = await users.findOne({ _id: new ObjectId(user_id) });
      if (!userExist) response.status(401).send({error: 'Unauthorized'});
      if (!request.body.name) response.status(400).send({error: 'Missing name'});
      if (request.body.type) {
        if (request.body.type !== 'folder' && request.body.type !== 'file' && request.body.type !== 'image') {
          response.status(400).send({error: 'Missing type'});
        }
      } else {
        response.status(400).send({error: 'Missing type'});
      }
      if (!request.body.data && request.body.type !== 'folder') {
        response.status(400).send({error: 'Missing data'});
      }
      if (request.body.parentId) {
        const files = dbClient.db.collection('files');
        const parentFile = await files.findOne({ _id: new ObjectId(parentId), user_Id: userExist._id });
        if (!parentFile) response.status(400).send({error: 'Parent not found'});
        if (parentFile.type !== 'folder') response.status(400).send({error: 'Parent is not a folder'});
      }

      if (request.body.type === 'folder') {
        const result = await files.insertOne({
          userId: userExist._id,
          name,
          type,
          parentId: parentId || 0,
          isPublic,
        });
        response.status(201).json({
          id: result.insertedId,
          userId: userExist._id,
          name,
          type,
          isPublic,
          parentId: parentId || 0,
        })
      } else {
        
      }

    } catch (err) {

    }
  }

  static getShow(request, response) {
  }

  static getIndex(request, response) {
  }

  static putPublish(request, response) {
  }

  static putUnpublish(request, response) {
  }

  static getFile(request, response) {
  }
}

export default FilesController;
module.exports = FilesController;