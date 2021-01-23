import { ApolloError, UserInputError } from "apollo-server-express";
import mongoose from "mongoose";

import { Branch, Service, Company } from "../models";
import { USER_TYPE, NO_ACCESS_RIGHT_CODE, EMPLOYEE_TYPE } from "../constants";
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

        let formattedBranches = [];
        for (const branch of filteredBranches) {
          const formattedBranch = await branchConverter(branch);
          formattedBranches.push(formattedBranch);
        }

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

      const invalid_input =
        id.length === 0 || !mongoose.Types.ObjectId.isValid(id);
      if (invalid_input) {
        return new UserInputError("Invalid ID number provided");
      }

      /**
       * get by id
       */
      try {
        const branch = await Branch.findById(id);
        const formattedBranch = await branchConverter(branch);
        return formattedBranch;
      } catch (err) {
        return new ApolloError(`Error finding branch with ID: ${id}`, 500, {
          Details: err,
        });
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
        return new ApolloError(
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
      /**
       * - only allow brand owner and manager:
       *  - check if company's owner === user.id
       * - validate input
       */

      /**
       * destructure user
       */
      const { user } = context;

      const allowAccess =
        user.type === USER_TYPE.BRANDOWNER ||
        user.employeeType === EMPLOYEE_TYPE.MANAGER;
      if (!allowAccess) {
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
          return new ApolloError("Only owner can update branch");
        }
      } catch (error) {
        return new ApolloError(
          `Error while looking for company with ID: ${branchInput.companyId}`,
          500,
          { Details: error }
        );
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
          `Error validating services, ID: ${branchInput.id}`,
          500,
          { Details: error, Input: branchInput.services }
        );
      }

      /**
       * update Branch
       */
      try {
        const updatedBranch = await Branch.findByIdAndUpdate(
          branchInput.id,
          branchInput,
          { new: true }
        );
        const processedPayload = await branchConverter(updatedBranch);

        return processedPayload;
      } catch (error) {
        return new ApolloError(
          `Error while updating branch, ID: ${branchInput.id}`,
          500,
          { Details: error }
        );
      }
    },
    deleteBranch: async (root, { id }, context, info) => {
      /**
       * - validate input
       * - only allow brand owner:
       *  - check if company's owner === user.id
       */

      /**
       * validate id
       */
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return new UserInputError(`Invalid ID: ${id}`);
      }

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
       * - get branch
       * - get company
       * -compare
       */
      try {
        const branch = await Branch.findById(id);
        const company = await Company.findById(branch.companyId);
        if (company.ownerID !== user.id) {
          return new ApolloError("Only owner can delete branch");
        }
      } catch (error) {
        return new ApolloError(
          `Error while looking for company with ID: ${id}`,
          500,
          {
            Details: error,
          }
        );
      }

      /**
       * delete branch
       */
      try {
        const deletedBranch = await Branch.findByIdAndDelete(id);
        const formattedBranch = await branchConverter(deletedBranch);
        return formattedBranch;
      } catch (error) {
        return ApolloError(`Error while deleting branch, ID: ${id}`);
      }
    },
  },
};
export default BranchResolver;
