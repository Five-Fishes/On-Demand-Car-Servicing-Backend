import { ApolloError, UserInputError } from "apollo-server-express";

import { Branch, Service, Company } from "../models";
import { USER_TYPE, NO_ACCESS_RIGHT_CODE } from "../constants";
import { FFInvalidFilterError } from "../utils/error";
import { servicesValidator } from "../utils/validator";
import { estimatedServiceTimeConverter } from "../utils/converter";

/**
 * get services by service id
 * @param {Object} branch
 */
const branchConverter = async (branch) => {
  let payload = branch;
  let services = [];
  for (const id of branch.services) {
    const service = await Service.findById(id);
    services.push(estimatedServiceTimeConverter(service));
  }
  payload._doc.services = services;
  return payload;
};

const BranchResolver = {
  Query: {
    branches: async (root, { filter }, context, info) => {
      /**
       * - validate filter
       * - get by filter
       */
      if (filter === null) {
        return new UserInputError("Invalid filter");
      }

      /**
       * try parse filter
       */
      try {
        filter = JSON.parse(filter);
      } catch (error) {
        return new FFInvalidFilterError(`Invalid filter: ${filter}`, {
          Details: error,
        });
      }

      /**
       * get by filter
       */
      try {
        const filteredBranches = await Branch.find(filter);
        const formattedBranches = filteredBranches.map((branch) =>
          branchConverter(branch)
        );
        return formattedBranches;
      } catch (err) {
        return new UserInputError("No branches are found with filter");
      }
    },
    branch: async (root, { id }, context, info) => {
      /**
       * - validate id
       * - get by id
       */

      const invalid_input = id.length === 0;
      if (invalid_input) {
        return new UserInputError("Invalid ID number provided");
      }
      try {
        const branch = await Branch.findById(id);
        return branch;
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
  },
  Mutation: {
    createBranch: async (root, { branchInput }, context, info) => {
      /**
       * - only allow brand owner:
       *  - check if company's owner === user.id
       * - validate input
       */

      /**
       * destructure user
       */
      const { user } = context;

      const isOwnerAccess = user.type === USER_TYPE.BRANDOWNER;
      if (!isOwnerAccess) {
        throw new ApolloError(
          `User type ${user.type} cannot perform this action`,
          NO_ACCESS_RIGHT_CODE
        );
      }

      /**
       * validate is the company own by this user
       */
      try {
        const company = await Company.findById(branchInput.companyId);
        if (company.ownerID !== user.id) {
          return new ApolloError("Only owner can create branch");
        }
      } catch (error) {
        new ApolloError(
          `Error while looking for company with ID: ${branchInput.companyId}`,
          500,
          { Details: error }
        );
      }

      if (branchInput === null) {
        return new ApolloError("Invalid input for new Branch");
      }

      /**
       * validate:
       * - service are all valid
       */
      try {
        const [isAllValid, errors] = await servicesValidator(
          branchInput.services
        );
        if (!isAllValid) {
          return new ApolloError(`Invalid ID(s): ${errors.toString()}`, 500, {
            Details: errors,
          });
        }
      } catch (error) {
        return new ApolloError(
          `Error validating services: ${error.message}`,
          500,
          { Details: error, Input: branchInput.services }
        );
      }

      /**
       * create new Branch
       */
      try {
        const newBranch = await Branch.create(branchInput);
        const processedPayload = await branchConverter(newBranch);
        return processedPayload;
      } catch (error) {
        return new ApolloError(
          `Error while creating branch: ${error.message}`,
          500,
          { Details: error }
        );
      }
    },
    updateBranch: async (root, { branchInput }, context, info) => {
      if (!branchInput.id) {
        return new UserInputError("Unable to update Branch with invalid id");
      }
      try {
        let branch = await Branch.findByIdAndUpdate(
          branchInput.id,
          {
            ...branchInput,
          },
          { new: true }
        ).then((res) => {
          return res;
        });
        return branch
          .populate("businesshours")
          .populate("services")
          .execPopulate();
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
    deleteBranch: async (root, { id }, context, info) => {
      if (!id) {
        return new UserInputError("No id is provided.");
      }
      try {
        const branch = await Branch.findById(id);
        if (branch) {
          const deleted = await Branch.findByIdAndRemove(id);
          return deleted;
        } else {
          return new UserInputError("Branch ID is not found.");
        }
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
  },
};
export default BranchResolver;
