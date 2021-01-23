import { ApolloError, UserInputError } from "apollo-server-express";
import Company from "../models/Company";
import User from "../models/User";

const CompanyResolver = {
  Query: {
    companies: async (root, { filter }, context, info) => {
      if (!filter) {
        return new UserInputError("No filter provided");
      }
      try {
        const filteredCompanies = await Company.find(JSON.parse(filter));
        return filteredCompanies;
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
    company: async (root, { id }, context, info) => {
      const invalid_input = id.length === 0;
      if (invalid_input) {
        return new UserInputError("Invalid ID number provided");
      }
      try {
        const company = await Company.findById(id);
        return company;
      } catch (err) {
        return new ApolloError(err.message, 500);
      }
    },
  },
  Mutation: {
    async createCompany(_, { companyInput }) {
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
    async updateCompany(_, { companyInput }) {
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
    async deleteCompany(_, { id }) {
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
