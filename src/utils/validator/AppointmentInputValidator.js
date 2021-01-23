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
export const createAppointmentValidator = async (appointmentInput, user) => {
  // validate the appointment date
  const validDate = new Date(appointmentInput.appointmentDate) > Date.now();
  // validate current customer creates an appointment
  const validCustomer = appointmentInput.customerID === user.id;
  // validate the branch
  let validBranch = false;
  try {
    validBranch = await Branch.findById(appointmentInput.branchID);
  } catch (error) {
    return new UserInputError(error.message, {
      Details: `Invalid Branch ID ${appointmentInput.branchID}`,
    });
  }
  // validate vehicle
  const customer = await User.findById(user.id);
  const validVehicle =
    customer.vehicle.find(
      (vehicle) => vehicle._id.toString() === appointmentInput.vehicleID
    ) || false;
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
    validDate &&
    validCustomer &&
    !!validBranch &&
    validVehicle &&
    !!validService
  );
};
