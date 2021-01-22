import { ApolloError, UserInputError } from "apollo-server";

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
    videoStorage: async (root, { id }, context, info) => {},
  },
  Mutation: {
    createVideoStorage: async (root, args, context, info) => {},
    updateVideoStorage: async (root, args, context, info) => {},
  },
};

export default VideoStorageResolver;
