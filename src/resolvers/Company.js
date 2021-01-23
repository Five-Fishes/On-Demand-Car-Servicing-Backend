import { ApolloError, UserInputError } from "apollo-server-express";
import mongoose from "mongoose";

import { User, Company } from "../models";
import { FFInvalidFilterError } from "../utils/error";

const CompanyResolver = {
  Query: {
    companies: async (root, { filter }, context, info) => {
      /**
       * - validate filter
       * - try parse filter
       * - search by filter
       */
      if (filter == null) {
        return new UserInputError("No filter provided");
      }

      /**
       * try parse
       */
      try {
        filter = JSON.parse(filter);
      } catch (error) {
        return new FFInvalidFilterError(
          `Filter provided: ${filter}, is invalid`,
          { Details: error }
        );
      }

      /**
       * find with filter
       */
      try {
        const filteredCompanies = await Company.find(filter);
        return filteredCompanies;
      } catch (err) {
        return new ApolloError(
          `Error while searching with filter ${filter}`,
          500,
          { Details: err }
        );
      }
    },
    company: async (root, { id }, context, info) => {
      /**
       * - validate id
       * - search by id
       */
      const invalid_input = !mongoose.Types.ObjectId.isValid(id);
      if (invalid_input) {
        return new UserInputError("Invalid ID number provided");
      }
      try {
        const company = await Company.findById(id);
        return company;
      } catch (err) {
        return new ApolloError(`Company with ID: ${id} not found!`, 500, {
          Details: err,
        });
      }
    },
  },
  Mutation: {
    createCompany: async (root, { companyInput }, context, info) => {
      if (companyInput === null) {
        return new ApolloError("Invalid input for new Company");
      }
      const ownerID = await User.findById(companyInput.ownerID);
      if (ownerID) {
        const company = await Company.create(companyInput);
        return company;
      } else {
        return new UserInputError("Owner is not a registered as user.");
      }
    },
    updateCompany: async (root, { companyInput }, context, info) => {
      if (!companyInput.id) {
        return new UserInputError("Unable to update Company with invalid id");
      }
      try {
        let company = await Company.findById(companyInput.id);
        if (company) {
          const ownerID = await User.findById(companyInput.ownerID);
          if (!ownerID) {
            return new UserInputError("No owner found with id");
          }
          let updateCompany = await Company.findByIdAndUpdate(
            companyInput.id,
            {
              ...companyInput,
            },
            { new: true }
          );
          return updateCompany;
        } else {
          return new UserInputError("No company found by id");
        }
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
    deleteCompany: async (root, { id }, context, info) => {
      if (!id) {
        return new UserInputError("Invalid ID unable to delete Company");
      }
      try {
        const company = await Company.findById(id);
        if (company) {
          const deleted = await Company.findByIdAndRemove(id);
          return deleted;
        } else {
          return new UserInputError("Company ID is not found.");
        }
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
  },
};
export default CompanyResolver;
