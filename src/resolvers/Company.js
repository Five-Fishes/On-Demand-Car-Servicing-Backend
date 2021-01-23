import { ApolloError, UserInputError } from "apollo-server-express";
import mongoose from "mongoose";

import { User, Company } from "../models";
import { FFInvalidFilterError } from "../utils/error";
import { USER_TYPE } from "../constants";

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
      /**
       * - validate input
       *  - is name taken?
       *  - is owner ID valid?
       */
      if (companyInput.id !== null) {
        return new ApolloError("ID should be null while creating company");
      }

      /**
       * validate company name
       */
      try {
        const existingCompany = await Company.findOne({
          companyNm: { $eq: companyInput.companyNm },
        });
        if (existingCompany) {
          return new ApolloError(
            `Name ${companyInput.companyNm} is taken`,
            500
          );
        }
      } catch (error) {
        return new ApolloError(
          `Error while validating name: ${companyInput.companyNm}`,
          500,
          { Details: error }
        );
      }

      /**
       * validate owner ID
       */
      try {
        const owner = await User.findById(companyInput.ownerID);
        if (owner === null) {
          return new ApolloError(
            `Error validating owner with ID: ${companyInput.ownerID}`,
            500
          );
        }
        if (owner.type !== USER_TYPE.BRANDOWNER) {
          return new ApolloError(
            `Only User type ${USER_TYPE.BRANDOWNER} can create company`
          );
        }
      } catch (error) {
        return new ApolloError(
          `Error validating owner ID: ${companyInput.ownerID}`
        );
      }

      /**
       * create company
       */
      try {
        const newCompany = await Company.create(companyInput);
        return newCompany;
      } catch (error) {
        return new ApolloError("Error creating company", 500, {
          Details: error,
        });
      }
    },
    updateCompany: async (root, { companyInput }, context, info) => {
      /**
       * - only owner can update
       * - check new name validity
       */

      /**
       * destructure context to get user
       */
      const { user } = context;
      if (user.id !== companyInput.ownerID) {
        return new ApolloError(
          `Only User ${companyInput.ownerID} can update this company details`,
          500
        );
      }

      /**
       * validate company name
       */
      try {
        const existingCompany = await Company.findOne({
          companyNm: { $eq: companyInput.companyNm },
        });
        if (existingCompany && existingCompany.id !== companyInput.id) {
          return new ApolloError(
            `Name ${companyInput.companyNm} is taken`,
            500
          );
        }
      } catch (error) {
        return new ApolloError(
          `Error while validating name: ${companyInput.companyNm}`,
          500,
          { Details: error }
        );
      }

      /**
       * perform update
       */
      try {
        const updatedCompany = await Company.findByIdAndUpdate(
          companyInput.id,
          companyInput,
          { new: true }
        );
        return updatedCompany;
      } catch (error) {
        return new ApolloError(
          `Failed to update Company ${companyInput.id}`,
          500,
          { Details: companyInput }
        );
      }
    },
    deleteCompany: async (root, { id }, context, info) => {
      /**
       * - validate id
       * - validate is owner
       * - perform delete
       */

      /**
       * destructure context to get user
       */
      const { user } = context;

      /**
       * validate id
       */
      const invalid_input = !mongoose.Types.ObjectId.isValid(id);
      if (invalid_input) {
        return new UserInputError("Invalid ID number provided");
      }

      /**
       * validate is owner
       */
      try {
        const company = await Company.findById(id);
        if (user.id !== company.ownerID) {
          return new ApolloError(
            `Only User ${companyInput.ownerID} can delete this company`,
            500
          );
        }
      } catch (error) {
        return new ApolloError(`Company with ID: ${id} not found`, 500, {
          Details: error,
        });
      }

      /**
       * perform delete
       */
      try {
        const deletedCompany = await Company.findByIdAndDelete(id);
        return deletedCompany;
      } catch (error) {
        return new ApolloError(`Error while deleting ${id}`, 500, {
          Details: error,
        });
      }
    },
  },
};
export default CompanyResolver;
