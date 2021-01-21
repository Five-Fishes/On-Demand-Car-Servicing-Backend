import { ApolloError, UserInputError } from "apollo-server-express";
import Company from "../models/Company";

const CompanyResolver = {
  Query: {
    companies: async(root, { filter } , context, info) => {
      if (!filter){
        throw new UserInputError("No filter provided");
      }
      const filteredCompanies = await Company.find(JSON.parse(filter));
      return filteredCompanies;
    },
    company: async (root, { id }, context, info) => {
      const invalid_input = id.length === 0;
      if (invalid_input) {
        throw new UserInputError("Invalid ID number provided");
      }
      const company = await Company.findById(id);
      return company;
    }
  },
  Mutation: {
    async createCompany(_, {companyInput}) {
      if (companyInput === null) {
        throw new ApolloError("Invalid input for new Company");
      }
      const newCompany = new Company({
        ...companyInput,
      });
      const company = await newCompany.save();
      return company;
    },
    async updateCompany(_, {companyInput}) {
      if(!companyInput.id) {
        throw new UserInputError("Unable to update Company with invalid id");
      }
      try{
        return await Company.findByIdAndUpdate(companyInput.id, {
          ...companyInput
        }, {new: true})
      } catch (err) {
        throw new ApolloError(err.message);
      }

    },
    async deleteCompany(_, { id } ) {
      if(!id){
        throw new UserInputError ("Invalid ID unable to delete Company");
      }
      try{
        const company = await Company.findById(id);
        if (company){
          Company.findByIdAndRemove(id, () => {});
          return "Company deleted.";
        } else {
          throw new UserInputError ("Company ID is not found.");
        }
      } catch(err){
        throw new ApolloError(err.message);
      }
    },
  } ,
};
export default CompanyResolver;