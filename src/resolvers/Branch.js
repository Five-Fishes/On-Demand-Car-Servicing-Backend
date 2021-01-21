import { ApolloError, UserInputError } from "apollo-server-express";
import Branch from "../models/Branch";

const BranchResolver = {
  Query: {
    branches: async(root, { filter } , context, info) => {
      if (!filter){
        throw new UserInputError("No filter provided");
      }
      const filteredBranchs = await Branch.find(JSON.parse(filter));
      return filteredBranchs;
    },
    branch: async (root, { id }, context, info) => {
      const invalid_input = id.length === 0;
      if (invalid_input) {
        throw new UserInputError("Invalid ID number provided");
      }
      const branch = await Branch.findById(id);
      return branch;
    }
  },
  Mutation: {
    async createBranch(_, {branchInput}) {
      if (branchInput === null) {
        throw new ApolloError("Invalid input for new Branch");
      }
      const newBranch = new Branch({
        ...branchInput,
      });
      const branch = await newBranch.save();
      return branch
        .populate("businesshours")
        .populate("services")
        .execPopulate();
    },
    async updateBranch(_, {branchInput}) {
      if(!branchInput.id) {
        throw new UserInputError("Unable to update Branch with invalid id");
      }
      try{
        let branch = await Branch.findByIdAndUpdate(branchInput.id, {
          ...branchInput,
        }, {new: true}).then (res => { return res; })
        return branch
          .populate("businesshours")
          .populate("services")
          .execPopulate();
      } catch (err) {
        throw new ApolloError(err.message);
      }

    },
    async deleteBranch(_, { id } ) {
      if(!id){
        throw new UserInputError ("Unable to delete Branch");
      }
      try{
        const branch = Branch.findById(id);
        if (branch){
          Branch.findByIdAndRemove(id, () => {});
          return "Branch deleted.";
        } else {
          throw new UserInputError ("Branch ID is not found.");
        }
      }catch (err){
        throw new ApolloError(err.message);
      }
    }
  } ,
};
export default BranchResolver;