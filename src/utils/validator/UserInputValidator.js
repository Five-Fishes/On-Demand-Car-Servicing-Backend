import { USER_TYPE, EMPLOYEE_TYPE } from "../../constants";

/**
 * Validate user
 * - If user is of type customer, should not allow vehicle to be null
 * - If is not customer, then allow null vehicle
 * @param {Object} userInput
 */
export const validateSignUp = (userInput) => {
  if (userInput.type === USER_TYPE.CUSTOMER && userInput.vehicle === null) {
    return false;
  }
  return (
    userInput.type !== null &&
    userInput.firstName !== null &&
    userInput.lastName !== null &&
    userInput.password !== null &&
    userInput.dateOfBirth !== null &&
    userInput.contactNo !== null &&
    userInput.email !== null
  );
};

export const validateLogIn = (email, password) => {
  return email !== null && password !== null;
};

/**
 * Role pairing logic
 * - Employee must pair with Staff/Manager
 * - Customer / Brand Owener must pair with None
 * @param {Object} userInput
 */
export const validateRole = (userInput) => {
  const isEmployee = userInput.type === USER_TYPE.EMPLOYEE;

  /**
   * If User is employee, he must have employee type
   */
  if (isEmployee) {
    return (
      userInput.employeeType === EMPLOYEE_TYPE.MANAGER ||
      userInput.employeeType === EMPLOYEE_TYPE.STAFF
    );
  } else {
    /**
     * If User is not employee, he must have null employee type
     */
    return userInput.employeeType === null;
  }
};
