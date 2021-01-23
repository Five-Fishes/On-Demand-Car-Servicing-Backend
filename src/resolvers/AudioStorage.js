import { ApolloError, UserInputError } from "apollo-server-express";
import mongoose, { mongo } from "mongoose";

import { AudioStorage } from "../models";
import { FFInvalidFilterError } from "../utils/error";

/**
 * format the Decimal128 tyoe to graphql float compliance pattern
 * @param {Object} audioStorageInput
 */
const audioLengthConverter = (audioStorageInput) => {
  audioStorageInput._doc.audioLength = audioStorageInput._doc.audioLength.toString();
  return audioStorageInput;
};

const AudioStorageResolver = {
  Query: {
    audioStorages: async (root, { filter }, context, info) => {
      /**
       * - validate filter
       * - query by filter
       */
      if (filter == null) {
        return new UserInputError("No filter provided");
      }

      /**
       * try parse filter
       */
      try {
        filter = JSON.parse(filter);
      } catch (error) {
        return new FFInvalidFilterError(
          `${error.message}, filter provided: ${filter}`,
          { Details: error }
        );
      }

      /**
       * perform serach by filter
       */
      try {
        const filteredAudioStorages = await AudioStorage.find(filter);
        const formattedAudioStorages = filteredAudioStorages.map(
          (audioStorage) => audioLengthConverter(audioStorage)
        );

        return formattedAudioStorages;
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
    audioStorage: async (root, { id }, context, info) => {
      /**
       * - validate id
       * - perform search
       */
      const invalidInput =
        id.length === 0 || !mongoose.Types.ObjectId.isValid(id);
      if (invalidInput) {
        return new UserInputError("Invalid ID number provided");
      }

      try {
        const audioStorage = await AudioStorage.findById(id);
        return audioLengthConverter(audioStorage);
      } catch (error) {
        return new ApolloError(
          `Error while trying to search for ID: ${id}`,
          500,
          { Details: error }
        );
      }
    },
  },
  Mutation: {
    createAudioStorage: async (root, { audioStorageInput }) => {
      /**
       * - validate length
       * - create new
       */

      if (audioStorageInput === null) {
        return new ApolloError("Invalid input for new AudioStorage");
      }

      /**
       * validate length
       */
      const isValidLength = audioStorageInput.audioLength >= 0;
      if (!isValidLength) {
        return new UserInputError(
          `Invalid audiolength ${audioStorageInput.audioLength}, length must be >= 0`
        );
      }

      /**
       * create new audio storage
       */
      try {
        const newAudioStorage = await AudioStorage.create(audioStorageInput);
        return audioLengthConverter(newAudioStorage);
      } catch (error) {
        return new ApolloError(`Error while creating: ${error.message}`, 500, {
          Details: error,
        });
      }
    },
    updateAudioStorage: async (root, { audioStorageInput }) => {
      /**
       * - validate length
       * - update by id
       */

      if (audioStorageInput === null) {
        return new ApolloError("Invalid input for new AudioStorage");
      }

      /**
       * validate length
       */
      const isValidLength = audioStorageInput.audioLength >= 0;
      if (!isValidLength) {
        return new UserInputError(
          `Invalid audiolength ${audioStorageInput.audioLength}, length must be >= 0`
        );
      }

      /**
       * create new audio storage
       */
      try {
        const updatedAudioStorage = await AudioStorage.findByIdAndUpdate(
          audioStorageInput.id,
          audioStorageInput,
          { new: true }
        );
        return audioLengthConverter(updatedAudioStorage);
      } catch (error) {
        return new ApolloError(`Error while updating: ${error.message}`, 500, {
          Details: error,
        });
      }
    },
    deleteAudioStorage: async (root, { id }) => {
      /**
       * - validate id
       * - delete
       */
      const invalidInput =
        id.length === 0 || !mongoose.Types.ObjectId.isValid(id);
      if (invalidInput) {
        return new UserInputError("Invalid ID number provided");
      }

      /**
       * delete
       */
      try {
        const deletedAudioStorage = await AudioStorage.findByIdAndDelete(id);
        return audioLengthConverter(deletedAudioStorage);
      } catch (error) {
        return new ApolloError(`Error while deleting ${error.message}`, 500, {
          Details: error,
        });
      }
    },
  },
};
export default AudioStorageResolver;
