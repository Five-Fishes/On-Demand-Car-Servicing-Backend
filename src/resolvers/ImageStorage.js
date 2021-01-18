import ImageStorage from "../models/ImageStorage";

const convertImageSizeDecimal = (imageStorage) => {
  imageStorage._doc.imageSize = imageStorage._doc.imageSize.toString();
  return imageStorage;
}

const ImageStorageResolver = {
  Query: {
    async getImageStorages(_, { filter }) {
      console.log(filter)
      let filterJson = {};
      if (filter) {
        filterJson = JSON.parse(filter);
      }
      console.log(filterJson)
      try {
        let imageStorages = await ImageStorage.find(filterJson);
        imageStorages.map(data => convertImageSizeDecimal(data));
        return imageStorages;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getImageStorage(_, { id }) {
      console.log(id)
      try {
        let imageStorage = await ImageStorage.findById(id);
        return convertImageSizeDecimal(imageStorage);
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createImageStorage(_, { imageStorageInput }) {
      const newImageStorage = new ImageStorage({
        ...imageStorageInput
      });
      let imageStorage = await newImageStorage.save();
      return convertImageSizeDecimal(imageStorage);
    },
    async updateImageStorage(_, { imageStorageInput }) {
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
        throw new Error(err);
      }
    }
  }
}

export default ImageStorageResolver;
