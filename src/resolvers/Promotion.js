import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from "apollo-server";
import mongoose from "mongoose";

import { Promotion } from "../models";
import { USER_TYPE } from "../constants";

const promotionConverter = (promotion) => {
  let payload = discountAmtConverter(promotion._doc);
  payload.image = imageSizeConverter(promotion._doc.image);
  promotion.promotionService.map((promotionService) => {
    estimatedServiceTimeConverter(promotionService._doc);
  });
  payload.promotionService = promotion.promotionService;
  return payload;
};

const discountAmtConverter = (promotion) => {
  promotion.discountAmt = promotion.discountAmt.toString();
  return promotion;
};

const imageSizeConverter = (imageStorage) => {
  try {
    imageStorage.imageSize = imageStorage.imageSize.toString();
  } catch (error) {
    console.error(error);
  }
  return imageStorage;
};

const estimatedServiceTimeConverter = (PromotionService) => {
  try {
    PromotionService.estimatedServiceTime = PromotionService.estimatedServiceTime.toString();
  } catch (error) {
    console.error(error);
  }
  return PromotionService;
};

//TODO: #60 @LUXIANZE Add auth check before appropriate query and mutations
const PromotionResolver = {
  Query: {
    promotions: async (root, { filter }, context, info) => {
      /**
       * - only allow logged in user
       * - check filter validity
       * - retrive based on filter
       */
      if (filter === null) {
        throw new UserInputError("Invalid filter");
      }

      /**
       * check filter validity
       */
      let parsedFilter;
      try {
        parsedFilter = JSON.parse(filter);
      } catch (error) {
        throw new ApolloError(error, 500);
      }

      /**
       * retrieve based on filter
       */
      let promotions = await Promotion.find(parsedFilter);
      promotions.map((promotion) => {
        promotionConverter(promotion);
      });

      return promotions;
    },
    promotion: async (root, { id }, context, info) => {
      /**
       * - only allow logged in user
       * - check id validity
       * - retrive based on id
       */

      /**
       * check id validity
       */
      if (id === null) {
        throw new UserInputError("No ID provided");
      }

      /**
       * validate id format
       */
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new UserInputError(`${id} is having an invalid format`);

      /**
       * retrive based on id
       */
      let promotion = await Promotion.findById(id);
      promotion = promotionConverter(promotion);
      promotion.id = promotion._id;

      return promotion;
    },
  },
  Mutation: {
    createPromotion: async (root, { promotionInput }, context, info) => {
      /**
       * - only allow logged in Brand Owner to create promotions
       * - throw if id provided
       * - check if the promotion name is used
       * - check if the date range is valid
       * - insert promotion
       */

      /**
       * check user type is Brand owner
       */
      if (context.user.type !== USER_TYPE.BRANDOWNER) {
        throw AuthenticationError("Invalid Permission");
      }

      /**
       * disallow id
       */
      if (promotionInput.id !== null) {
        throw new UserInputError("ID not allowed while creating promotion");
      }

      /**
       * - check validity of promotion name
       * - disallow name if the promotion is still ongoing
       */
      const existingPromotion = await Promotion.findOne({
        promotionNm: promotionInput.promotionNm,
      });
      if (
        existingPromotion &&
        new Date(existingPromotion.promotionEnd) > Date.now()
      ) {
        throw new ApolloError("Prmotion name alread taken");
      }

      /**
       * date range validity check:
       * - must start at least one week from now
       * - end date > start date
       */
      const validStartDt =
        new Date(promotionInput.promotionStart) >
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
      const validEndDt =
        new Date(promotionInput.promotionStart) <
        new Date(promotionInput.promotionEnd);
      if (!validStartDt || !validEndDt) {
        throw UserInputError("Invalid date");
      }

      promotionInput.image._id = promotionInput.image.id;
      promotionInput.promotionService.forEach((element) => {
        element._id = element.id;
      });
      promotionInput.promotionBranch.forEach((element) => {
        element._id = element.id;
      });

      let newPromotion = await Promotion.create(promotionInput);

      newPromotion = promotionConverter(newPromotion);
      newPromotion.id = newPromotion._id;

      return newPromotion;
    },
    updatePromotion: async (root, { promotionInput }, context, info) => {
      /**
       * - only allow loggedin brandowner
       * - valid id check
       * - name validity check
       * - date validity check
       */

      /**
       * check user type is Brand owner
       */
      if (context.user.type !== USER_TYPE.BRANDOWNER) {
        throw AuthenticationError("Invalid Permission");
      }

      const validId = mongoose.Types.ObjectId.isValid(promotionInput.id);
      const existingPromotionById = await Promotion.findById(promotionInput.id);
      if (!validId || existingPromotionById === null) {
        throw new UserInputError("Invalid ID");
      }

      /**
       * - check validity of promotion name
       * - disallow name if the promotion is still ongoing
       * - allow if the name is same as previous name (means no update)
       */
      const existingPromotion = await Promotion.findOne({
        promotionNm: { $eq: promotionInput.promotionNm },
      });
      if (
        existingPromotion &&
        existingPromotion.promotionNm !== promotionInput.promotionNm
      ) {
        if (new Date(existingPromotion.promotionEnd) > Date.now()) {
          throw new ApolloError("Prmotion name alread taken");
        }
      }

      /**
       * date range validity check:
       * - must start at least one week from now
       * - end date > start date
       */
      const validStartDt =
        new Date(promotionInput.promotionStart) >
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
      const validEndDt =
        new Date(promotionInput.promotionStart) <
        new Date(promotionInput.promotionEnd);
      if (!validStartDt || !validEndDt) {
        throw UserInputError("Invalid date");
      }

      let updatedPromotion = await Promotion.findByIdAndUpdate(
        promotionInput.id,
        promotionInput,
        { new: true }
      );
      updatedPromotion = promotionConverter(updatedPromotion);
      updatedPromotion.id = updatedPromotion._id;

      return updatedPromotion;
    },
    deletePromotion: async (root, { id }, context, info) => {
      /**
       * - only allow loggedin brandowner
       * - validate id
       * - delete
       */

      /**
       * check user type is Brand owner
       */
      if (context.user.type !== USER_TYPE.BRANDOWNER) {
        throw AuthenticationError("Invalid Permission");
      }

      /**
       * validate id format
       */
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw UserInputError("Invalid Id format");
      }

      let deletedPromotion = await Promotion.findByIdAndDelete(id);
      deletedPromotion = promotionConverter(deletedPromotion);
      deletedPromotion.id = deletedPromotion._id;

      return deletedPromotion;
    },
  },
};
export default PromotionResolver;
