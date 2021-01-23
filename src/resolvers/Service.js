import { ApolloError, UserInputError } from "apollo-server";

import { Service } from "../models";
import { USER_TYPE, EMPLOYEE_TYPE } from "../constants";
import { estimatedServiceTimeConverter } from "../utils/converter";

/**
 * Validate if the user trying to access this mutation is a manager or brand owner
 * - manager can only modify details
 * - owner can create and delete + other operations
 * @param {USER_TYPE} type
 * @param {EMPLOYEE_TYPE} employeeType
 */
const roleValidator = (type, employeeType) => {
  return (
    type === USER_TYPE.BRANDOWNER ||
    (type === USER_TYPE.EMPLOYEE && employeeType === EMPLOYEE_TYPE.MANAGER)
  );
};

const ServiceResolver = {
  Query: {
    services: async (root, { filter }, context, info) => {
      /**
       * - validate filter
       * - try parse filter
       * - retrieve
       */

      /**
       * validate filter
       */
      if (filter === null) {
        return new UserInputError("No filter provided");
      }

      /**
       * try parse filter
       */
      try {
        filter = JSON.parse(filter);
      } catch (error) {
        return new ApolloError("Unable to resolve filter", 500);
      }

      /**
       * retrieve with filter
       */
      let services = await Service.find(filter);
      services.map((service) => estimatedServiceTimeConverter(service));

      return services;
    },
    service: async (root, { id }, context, info) => {
      /**
       * - validate, disallow if provided id
       * - allow all access
       */

      /**
       * must have ID
       */
      if (id === null) {
        throw UserInputError("No ID provided to search");
      }

      /**
       * validate for existing
       */
      let existingService = await Service.findById(id);
      if (existingService === null) {
        throw UserInputError("no service with this ID");
      }
      existingService = estimatedServiceTimeConverter(existingService);

      return existingService;
    },
  },
  Mutation: {
    createService: async (root, { serviceInput }, context, info) => {
      /**
       * - validate, disallow if provided id
       * - allow all access
       * - validate for existing name
       */

      /**
       * disallow ID
       */
      if (serviceInput.id) {
        throw UserInputError("Received id at create mutatiion");
      }

      /**
       * validate for existing name
       */
      const existingService = await Service.findOne({
        serviceNm: { $eq: serviceInput.serviceNm },
      });
      // suggest to format the name string like brandID + serviceName to enable same name for different brands
      if (existingService) {
        throw UserInputError("Name already taken");
      }

      /**
       * create if passes all validations
       */
      let newService = await Service.create(serviceInput);
      newService = estimatedServiceTimeConverter(newService);

      return newService;
    },
    updateService: async (root, { serviceInput }, context, info) => {
      /**
       * - validate, disallow if provided id
       * - allow manager and brand owner
       */

      /**
       * destructure context user
       */
      const { type, employeeType } = context.user;

      /**
       * validate role
       */
      if (!roleValidator(type, employeeType)) {
        return new ApolloError(
          "Only brand owner and manager can perform this operation"
        );
      }

      /**
       * must have ID
       */
      if (serviceInput.id === null) {
        throw UserInputError("No ID provided to update");
      }

      /**
       * validate for existing
       */
      let existingService = await Service.findById(serviceInput.id);
      if (existingService === null) {
        throw UserInputError("no service with this ID");
      }

      /**
       * prevent name duplication
       * check if same name but different id (means not itself)
       */
      let serviceByName = await Service.find({
        serviceNm: { $eq: serviceInput.serviceNm },
      });
      if (serviceByName.id !== serviceInput.id) {
        throw ApolloError("Name taken", 500);
      }

      let service = await Service.findByIdAndUpdate(
        serviceInput.id,
        serviceInput,
        { new: true }
      );
      service = estimatedServiceTimeConverter(service);

      return service;
    },
    deleteService: async (root, { id }, context, info) => {
      /**
       * - validate, disallow if provided id
       * - only allow brand owner
       */

      /**
       * destructure current user
       * only allow system admin to modify
       */
      const { type } = context.user;
      const isAdmin =
        type !== USER_TYPE.BRANDOWNER &&
        type !== USER_TYPE.CUSTOMER &&
        type !== USER_TYPE.EMPLOYEE;
      if (!isAdmin) {
        return new ApolloError("User do not have access right to delete", 500);
      }

      /**
       * must have ID
       */
      if (id === null) {
        throw UserInputError("No ID provided to delete");
      }

      /**
       * validate for existing
       */
      const existingService = await Service.findById(id);
      if (existingService == null) {
        throw UserInputError("no service with this ID");
      }

      /**
       * delete if passes all validations
       */
      let deletedService = await Service.findByIdAndRemove(id);
      deletedService = estimatedServiceTimeConverter(deletedService);

      return deletedService;
    },
  },
};

export default ServiceResolver;
