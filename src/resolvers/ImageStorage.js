import ImageStorage from "../models/ImageStorage";
import { ApolloError, UserInputError } from "apollo-server-express"

const convertImageSizeDecimal = (imageStorage) => {
  imageStorage._doc.imageSize = imageStorage._doc.imageSize.toString();
  return imageStorage;
}

const ImageStorageResolver = {
  Query: {
    async getImageStorages(_, { filter }) {
      let filterJson = {};
      if (filter) {
        filterJson = JSON.parse(filter);
      }
      try {
        let imageStorages = await ImageStorage.find(filterJson);
        imageStorages.map(data => convertImageSizeDecimal(data));
        return imageStorages;
      } catch (err) {
        return new ApolloError(err.message);
      }
    },
    async getImageStorage(_, { id }) {
      try {
        let imageStorage = await ImageStorage.findById(id);
        if (!imageStorage) {
          return new ApolloError("Image Storage not found with id");
        }
        return convertImageSizeDecimal(imageStorage);
      } catch (err) {
        return new ApolloError(err.message);
      }
    }
  },
  Mutation: {
    async createImageStorage(_, { imageStorageInput }) {
      if (imageStorageInput.id) {
        return new ApolloError("New Image Storage cannot have id");
      }
      const newImageStorage = new ImageStorage({
        ...imageStorageInput
      });
      try{
        let imageStorage = await newImageStorage.save();
        return convertImageSizeDecimal(imageStorage);
      } catch(err) {
        return new ApolloError(err.message);
      }
    },
    async updateImageStorage(_, { imageStorageInput }) {
      if (!imageStorageInput.id) {
        return new UserInputError("Update Image Storage must have id");
      }
      try {
        const imageStorage = await ImageStorage.findByIdAndUpdate(imageStorageInput.id, {
          imageSize: imageStorageInput.imageSize,
          imageURL: imageStorageInput.imageURL,
          imageFileNm: imageStorageInput.imageFileNm,
          imageType: imageStorageInput.imageType
        }, {new: true})
        return convertImageSizeDecimal(imageStorage);
      } catch (err) {
        return new ApolloError(err.message);
      }
    }
  }
}

export default ImageStorageResolver;
