import ImageStorage from "../models/ImageStorage";

const convertImageSizeDecimal = (imageStorage) => {
  imageStorage._doc.imageSize = imageStorage._doc.imageSize.toString();
  return imageStorage;
}

const ImageStorageResolver = {
  Query: {
    async getImageStorages(_) {
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
    async createImageStorage(_, body) {
      console.log("Original Structure: ", body.imageStorageInput)
      const newImageStorage = new ImageStorage({
        ...body.imageStorageInput
      });
      let imageStorage = await newImageStorage.save();
      return convertImageSizeDecimal(imageStorage)
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
