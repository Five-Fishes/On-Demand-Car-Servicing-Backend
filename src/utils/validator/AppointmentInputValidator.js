import { UserInputError } from "apollo-server-express";
import { USER_TYPE } from "../../constants";

import { User, Service, Branch } from "../../models";

/**
 * Validate the appointment to create, considering fields validity of:
 * - appointmentdate
 * - customerID
 * - branchID
 * - serviceID
 * - vehicleID
 * - serviceID
 * @param {Object} appointmentInput
 * @param {Object} user
 */
export const appointmentInputValidator = async (appointmentInput, user) => {
  // validate the appointment date
  const validDate = new Date(appointmentInput.appointmentDate) > Date.now();

  // validate current customer creates an appointment
  const validRole = roleValidator(appointmentInput.customerID, user);

  // validate the branch
  let validBranch = false;
  try {
    validBranch = await Branch.findById(appointmentInput.branchID);
  } catch (error) {
    return new UserInputError(error.message, {
      Details: `Invalid Branch ID ${appointmentInput.branchID}`,
    });
  }

  // validate the service
  let validService = false;
  try {
    validService = await Service.findById(appointmentInput.serviceID);
  } catch (error) {
    return new UserInputError(error.message, {
      Details: `Invalid Seervice ID ${appointmentInput.serviceID}`,
    });
  }

  return (
    validDate && validRole && !!validBranch && !!validService
  );
};

/**
 * - validate is the user same as the person who creates this appointment
 * - or is manager/staff
 * @param {String} currentId
 * @param {Object} userId
 */
export const roleValidator = (currentId, user) => {
  const isCustomer = currentId === user.id;
  const isStaffOrManager = user.type === USER_TYPE.EMPLOYEE;
  return isCustomer || isStaffOrManager;
};
