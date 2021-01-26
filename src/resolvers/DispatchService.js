import DispatchService from "../models/DispatchService";
import { DISPATCH_SERVICE_STATUS, EMPLOYEE_TYPE, USER_TYPE } from "../constants/index";
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server-express";

import User from "../models/User";
import Branch from "../models/Branch";
import Service from "../models/Service";

const convertEstimatedServiceTime = (dispatchService) => {
  dispatchService._doc.service._doc.estimatedServiceTime = dispatchService._doc.service._doc.estimatedServiceTime.toString();
  return dispatchService;
}

const validateUpdateStatus = (originalDispatchService, user, updatingStatus) => {
  
  if (originalDispatchService.status === DISPATCH_SERVICE_STATUS.COMPLETED) {
    return "Completed Dispatch Service cannot update status";
  }
  /**
   * Cancel Dispatch Service can only done:
   * - customer that request dispatch service
   * - employee take up the dispatch service
   */
  if (updatingStatus === DISPATCH_SERVICE_STATUS.CANCELLED &&
    (!originalDispatchService.employee ||
      !(user.id === originalDispatchService.customer.toString() ||
        user.id === originalDispatchService.employee.toString())
    )
  ) {
    return "Only Dispatch Service customer or employee can cancel the service";
  }
  /**
   * Complete Dispatch Service can only done:
   * - dipatch service is original accepted
   * - employee take up the dispatch service
   */
  if (updatingStatus === DISPATCH_SERVICE_STATUS.COMPLETED){
    if (originalDispatchService.status !== DISPATCH_SERVICE_STATUS.ACCEPTED || 
      user.id !== originalDispatchService.employee.toString()
    ) {
      return "Only employee can mark the service as COMPLETED after provide service";
    }
  }
  /**
   * Reject Dispatch Service can only done:
   * - Manager of the target branch
   */
  if (updatingStatus === DISPATCH_SERVICE_STATUS.REJECTED &&
    !(user.type === USER_TYPE.EMPLOYEE && 
      user.employeeType === EMPLOYEE_TYPE.MANAGER && 
      user.employmentBranch === originalDispatchService.branch.toString()
    )
  ) {
    return "Only Manager of the target branch can reject the dispatch service";
  }
  /**
   * Accept Dispatch Service can only done:
   * - employee that work on target branch
   */
  if (updatingStatus === DISPATCH_SERVICE_STATUS.ACCEPTED &&
    !(user.type === USER_TYPE.EMPLOYEE && 
      user.employmentBranch === originalDispatchService.branch.toString()
    )
  ) {
    return "Only Employee of the target branch can accept the dispatch service";
  }
  return true;
}

const validateBranchService = (branch, serviceId) => {
  if (!branch.hasDispatchService) {
    return "Branch does not provide dispatch service currently";
  }
  const serviceDetails = branch.services.filter(service => service.id.toString() === serviceId.toString());
  if (serviceDetails.length < 1) {
    return "Branch is not provide the target service";
  }
  if (!serviceDetails[0].isDispatchAvailable) {
    return "Service is not available for dispatch";
  }
  return true;
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
          .populate("branch")
          .sort({status: "desc", createdAt: "desc"});
        dispatchServices.map(data => convertEstimatedServiceTime(data));
        return dispatchServices;
      } catch(err) {
        return new ApolloError(err.message);
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
        return convertEstimatedServiceTime(dispatchService);
      } catch(err) {
        return new ApolloError(err.message);
      }
    }
  },
  Mutation: {
    async createDispatchService(_, { dispatchServiceInput }, context) {
      if (dispatchServiceInput.id) {
        return new UserInputError("New Dispatch Service cannot have id");
      }
      if (context.user.type !== USER_TYPE.CUSTOMER) {
        return new AuthenticationError("Only customer can create dispatch service");
      }
      if (new Date(dispatchServiceInput.dispatchTimeStamp) < Date.now()) {
        return new UserInputError("Dispatch Service Timestamp cannot be early than now");
      }

      const branch= await Branch.findById(dispatchServiceInput.branch);
      const branchChecked = validateBranchService(branch, dispatchServiceInput.service);
      if (branchChecked !== true) {
        return new UserInputError(branchChecked);
      }
      
      try {
        let newDispatchService = new DispatchService({
          ...dispatchServiceInput,
          status: DISPATCH_SERVICE_STATUS.PENDING,
          customer: context.user.id,
          employee: null,
          createdAt: new Date().toISOString()
        });
        let dispatchService = await newDispatchService.save();
        dispatchService = await dispatchService
          .populate("customer")
          .populate("employee")
          .populate("service")
          .populate("branch")
          .execPopulate();
        return convertEstimatedServiceTime(dispatchService);
      } catch(err) {
        return new ApolloError(err.message);
      }
    },
    async updateDispatchService(_, { dispatchServiceInput }, context) {
      if (!dispatchServiceInput.id) {
        return new UserInputError("Update Dispatch Service must have id");
      }
      try {
        let originalDispatchService = await DispatchService.findById(dispatchServiceInput.id);
        if (!originalDispatchService) {
          return new ApolloError("Dispatch Service not found with id");
        }
        if (
          originalDispatchService.status === DISPATCH_SERVICE_STATUS.CANCELLED || 
          originalDispatchService.status === DISPATCH_SERVICE_STATUS.REJECTED
        ) {
          return new ApolloError("Cancelled/Rejected Dispatch Service cannot be update");
        }
        
        if (dispatchServiceInput.status !== originalDispatchService.status) {
          const statusUpdateCheck = validateUpdateStatus(originalDispatchService, context.user, dispatchServiceInput.status)
          if (statusUpdateCheck !== true) {
            return new ApolloError(statusUpdateCheck);
          }
        }
        let dispatchService = await DispatchService.findByIdAndUpdate(dispatchServiceInput.id, {
          ...dispatchServiceInput,
          employee: dispatchServiceInput.status === DISPATCH_SERVICE_STATUS.ACCEPTED ? context.user.id : originalDispatchService.employee,
          customer: originalDispatchService.customer,
          branch: originalDispatchService.branch,
          service: originalDispatchService.service
        }, {new: true});
        dispatchService = await dispatchService
          .populate("customer")
          .populate("employee")
          .populate("service")
          .populate("branch")
          .execPopulate();
        return convertEstimatedServiceTime(dispatchService);
      } catch(err) {
        return new ApolloError(err.message);
      }
    }
  }
}

export default DispatchServiceResolver;