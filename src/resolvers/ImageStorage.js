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
        throw new ApolloError(err);
      }
    },
    async getImageStorage(_, { id }) {
      try {
        let imageStorage = await ImageStorage.findById(id);
        return convertImageSizeDecimal(imageStorage);
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  },
  Mutation: {
    async createImageStorage(_, { imageStorageInput }) {
      if (imageStorageInput.id) {
        throw new ApolloError("New Image Storage cannot have id");
      }
      const newImageStorage = new ImageStorage({
        ...imageStorageInput
      });
      let imageStorage = await newImageStorage.save();
      return convertImageSizeDecimal(imageStorage);
    },
    async updateImageStorage(_, { imageStorageInput }) {
      if (!imageStorageInput.id) {
        throw new UserInputError("Update Image Storage must have id");
      }
      try {
        return await ImageStorage.findByIdAndUpdate(imageStorageInput.id, {
          imageSize: imageStorageInput.imageSize,
          imageURL: imageStorageInput.imageURL,
          imageFileNm: imageStorageInput.imageFileNm,
          imageType: imageStorageInput.imageType
        }, {new: true})
        .then(res => {          
          return convertImageSizeDecimal(res);
        })
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  }
}

export default ImageStorageResolver;
