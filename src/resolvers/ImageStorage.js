import ImageStorage from "../models/ImageStorage";

const ImageStorageResolver = {
  Query: {
    async getImageStorages() {
      try {
        return await ImageStorage.find();
      } catch (err) {
        throw new Error(err);
      }
    },
    async getImageStorage(_, {imageStorageId}) {
      try {
        return await ImageStorage.findById(imageStorageId);
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createImageStorage(_, { body }) {
      const newImageStorage = new ImageStorage({
        body
      });
      return await newImageStorage.save();
    },
    async updateImageStorage(_, { body }) {
      try {
        ImageStorage.findByIdAndUpdate(body.id, {
          imageSize: body.imageSize,
          imageURL: body.imageURL,
          imageFileNm: body.imageFileNm,
          imageType: body.imageType
        })
        .then(res => {
          return res._doc;
        })
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}

export default ImageStorageResolver;
