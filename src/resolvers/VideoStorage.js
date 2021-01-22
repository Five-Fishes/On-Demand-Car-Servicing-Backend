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
      if (id === null || mongoose.Types.ObjectId.isValid(id)) {
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
    createVideoStorage: async (
      root,
      { videoStorageInput },
      context,
      info
    ) => {},
    updateVideoStorage: async (root, args, context, info) => {},
  },
};

export default VideoStorageResolver;
