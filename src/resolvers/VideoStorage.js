import { ApolloError, UserInputError } from "apollo-server";
import mongoose from "mongoose";

import { VideoStorage } from "../models";

const videoSizeConverter = (video) => {
  video._doc.videoSize = video._doc.videoSize.toString();
  return video;
};

const VideoStorageResolver = {
  Query: {
    videoStorages: async (root, { filter }, context, info) => {
      /**
       * - validate filter
       * - validatte filter parsing
       * - execute search
       */

      /**
       * validate filter
       */
      if (filter === null) {
        throw new UserInputError("No fiilter provided");
      }

      /**
       * try parse filter
       */
      try {
        filter = JSON.parse(filter);
      } catch (error) {
        throw new ApolloError("Invalid filter format", 500);
      }

      /**
       * execute search
       */
      let videos = await VideoStorage.find(filter);
      videos.map((video) => videoSizeConverter(video));

      return videos;
    },
    videoStorage: async (root, { id }, context, info) => {
      /**
       * - check id validity
       * - execute search video by id
       */

      /**
       * id validity check
       */
      if (id === null || !mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError("Please check ID provided");
      }

      /**
       * search video by id
       */
      let video = await VideoStorage.findById(id);
      if (video === null) {
        throw new ApolloError("Resource not found", 500);
      }
      video = videoSizeConverter(video);

      return video;
    },
  },
  Mutation: {
    createVideoStorage: async (root, { videoStorageInput }, context, info) => {
      /**
       * - id must be null
       * - insert if valid
       */

      /**
       * id validity check
       */
      if (videoStorageInput.id) {
        throw new UserInputError("ID must be null to create");
      }

      /**
       * insert
       */
      let newVideo;
      try {
        newVideo = await VideoStorage.create(videoStorageInput);
      } catch (error) {
        throw new ApolloError("Failed to insert ");
      }
      newVideo = videoSizeConverter(newVideo);

      return newVideo;
    },
    updateVideoStorage: async (root, { videoStorageInput }, context, info) => {
      /**
       * - validate id
       * - check for existing
       */

      /**
       * validate id
       */
      if (
        videoStorageInput.id === null ||
        !mongoose.Types.ObjectId.isValid(videoStorageInput.id)
      ) {
        throw new UserInputError("Invalid ID provided");
      }

      /**
       * - check for existing
       */
      const existingVideo = await VideoStorage.findById(videoStorageInput.id);
      if (existingVideo === null) {
        throw new ApolloError(
          `No video with ID:${videoStorageInput.id} is found`,
          500
        );
      }

      /**
       * perform update
       */
      let updatedVideo = await VideoStorage.findByIdAndUpdate(
        videoStorageInput.id,
        videoStorageInput,
        { new: true }
      );
      updatedVideo = videoSizeConverter(updatedVideo);

      return updatedVideo;
    },
  },
};

export default VideoStorageResolver;
