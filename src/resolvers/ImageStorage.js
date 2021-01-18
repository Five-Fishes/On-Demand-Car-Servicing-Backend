import ImageStorage from "../models/ImageStorage";

const convertImageSizeDecimal = (imageStorage) => {
  imageStorage._doc.imageSize = imageStorage._doc.imageSize.toString();
  return imageStorage;
}

const ImageStorageResolver = {
  Query: {
    async getImageStorages(_, body) {
      let filterJson = {};
      if (body.hasOwnProperty("filter") && body.filter) {
        filterJson = JSON.parse(body.filter);
      }
      try {
        let imageStorages = await ImageStorage.find(filterJson);
        imageStorages.map(data => convertImageSizeDecimal(data));
        return imageStorages;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getImageStorage(_, {imageStorageId}) {
      try {
        let imageStorage = await ImageStorage.findById(imageStorageId);
        return convertImageSizeDecimal(imageStorage);
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createImageStorage(_, body) {
      const newImageStorage = new ImageStorage({
        ...body.imageStorageInput
      });
      let imageStorage = await newImageStorage.save();
      return convertImageSizeDecimal(imageStorage);
    },
    async updateImageStorage(_, body) {
      const imageStorageInput = {...body.imageStorageInput};
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
