import DispatchService from "../models/DispatchService";
import { ApolloError, UserInputError } from "apollo-server-express";

import User from "../models/User";
import Branch from "../models/Branch";
import Service from "../models/Service";

const DispatchServiceStatus = {
  "PENDING": "PENDING",
  "REJECTED": "REJECTED",
  "ACCEPTED": "ACCEPTED",
  "COMPLETED": "COMPLETED",
  "CANCELLED": "CANCELLED"
}

const DispatchServiceResolver = {
  Query: {
    async getDispatchServices(_, { filter }) {
      let filterJson = {};
      if (filter) {
        filterJson = JSON.parse(filter);
      }
      try {
        let dispatchServices = await DispatchService
          .find(filterJson)
          .populate("customer")
          .populate("employee")
          .populate("service")
          .populate("branch");
        return dispatchServices;
      } catch(err) {
        throw new ApolloError(err.message);
      }
    },
    async getDispatchService(_, { id }) {
      try {
        let dispatchService = await DispatchService
          .findById(id)
          .populate("customer")
          .populate("employee")
          .populate("service")
          .populate("branch");
        return dispatchService;
      } catch(err) {
        throw new ApolloError(err.message);
      }
    }
  },
  Mutation: {
    async createDispatchService(_, { dispatchServiceInput }) {
      if (dispatchServiceInput.id) {
        throw new UserInputError("New Dispatch Service cannot have id");
      }
      const customer = await User.findById(dispatchServiceInput.customer);
      /**
       * TODO: Check if customerID = user.id
       */
      const branch= await Branch.findById(dispatchServiceInput.branch);
      if (!branch._doc.hasDispatchService) {
        throw new ApolloError("Branch does not provide dispatch service currently");
      }
      const service = await Service.findById(dispatchServiceInput.service);
      if (!service._doc.isDispatchAvailable) {
        throw new ApolloError("Service is not available for dispatch");
      }
      dispatchServiceInput.status = DispatchServiceStatus.PENDING;
      try {
        let newDispatchService = new DispatchService({
          ...dispatchServiceInput,
          createdAt: new Date().toISOString()
        });
        let dispatchService = await newDispatchService.save();
        dispatchService = dispatchService
          .populate("customer")
          .populate("employee")
          .populate("service")
          .populate("branch")
          .execPopulate();
        return dispatchService;
      } catch(err) {
        throw new ApolloError(err.message);
      }
    },
    async updateDispatchService(_, { dispatchServiceInput }) {
      if (!dispatchServiceInput.id) {
        throw new UserInputError("Update Dispatch Service must have id");
      }
      try {
        let originalDispatchService = await DispatchService.findById(dispatchServiceInput.id);
        if (!originalDispatchService) {
          throw new ApolloError("Dispatch Service not found with id");
        }
        if (originalDispatchService._doc.status === DispatchServiceStatus.CANCELLED || originalDispatchService._doc.status === DispatchServiceStatus.REJECTED) {
          throw new ApolloError("Cancelled/Rejected Dispatch Service cannot be update");
        }
        const customer = await User.findById(originalDispatchService._doc.customer);
        // TODO: is Customer == user and updatinStatus = CANCELLED
        if (originalDispatchService._doc.employee) {
          const employee = await User.findById(originalDispatchService._doc.employee);
          // TODO: is EmployeeeId exist and user == employee
        } else {
          // TODO: not user is employee (employmentBranch) == branchId
        }
        let dispatchService = await DispatchService.findByIdAndUpdate(dispatchServiceInput.id, {
          ...dispatchServiceInput
        }, {new: true});
        dispatchService = dispatchService
          .populate("customer")
          .populate("employee")
          .populate("service")
          .populate("branch")
          .execPopulate();
        return dispatchService;
      } catch(err) {
        throw new ApolloError(err.message);
      }
    }
  }
}

export default DispatchServiceResolver;