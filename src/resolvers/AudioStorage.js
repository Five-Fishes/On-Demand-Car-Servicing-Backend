import { ApolloError, UserInputError } from "apollo-server-express";
import AudioStorage from "../models/AudioStorage";

const AudioStorageResolver = {
  Query: {
    audioUploads:(_,args) => {},
    audioStorages: async (root, { filter } , context, info) => {
      if (!filter){
        throw new UserInputError("No filter provided");
      }
      try{
        const filteredAudioStorages =await AudioStorage.find(JSON.parse(filter))
        return filteredAudioStorages;
      }catch(err){
        throw new ApolloError(err.message,500)
      }
     
    },
    audioStorage: async (root, { id }, context, info) => {
      const invalid_input = id.length === 0;
      if (invalid_input) {
        throw new UserInputError("Invalid ID number provided");
      }
      const audioStorage = await AudioStorage.findById(id);
      return audioStorage;
    }
  },
  Mutation: {
    async createAudioStorage(_, {audioStorageInput}) {
      if (audioStorageInput === null) {
        throw new ApolloError("Invalid input for new AudioStorage");
      }
      const newAudioStorage = new AudioStorage({
        ...audioStorageInput,
      });
      const audioStorage = await newAudioStorage.save();
      return audioStorage;
    },
    async updateAudioStorage(_, {audioStorageInput}) {
      if(audioStorageInput.id === null) {
        throw new UserInputError("Unable to update AudioStorage with invalid id");
      }
      try{
        return await AudioStorage.findByIdAndUpdate(audioStorageInput.id, {
          audioContent: audioStorageInput.audioContent,
          audioURL: audioStorageInput.audioURL,
          audioType: audioStorageInput.audioType,
          audioLength: audioStorageInput.audioLength,
          AudioStorageStatus: audioStorageInput.AudioStorageStatus
        }, {new: true})
      } catch (err) {
        throw new ApolloError(err.message,500);
      }

    },
    uploadAudioStorage: (_,args) => {
      return args.file.then(file =>{
        //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
        //file.createReadStream() is a readable node stream that contains the contents of the uploaded file
        return file;
      })
    },
    async deleteAudioStorage(_, { id } ) {
      if(!id){
        throw new UserInputError ("Unable to delete AudioStorage");
      }
      const audioStorage = AudioStorage.findById(id);
      if (audioStorage){
        let deleted = await AudioStorage.findByIdAndRemove(id);
        return deleted;
      } else {
        throw new UserInputError ("AudioStorage ID is not found.");
      }
    },
  } ,
};
export default AudioStorageResolver;