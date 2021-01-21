import { USER_TYPE, EMPLOYEE_TYPE } from "../../constants";

export const validateSignUp = (userInput) => {
  return (
    userInput.type !== null &&
    userInput.firstName !== null &&
    userInput.lastName !== null &&
    userInput.password !== null &&
    userInput.dateOfBirth !== null &&
    userInput.contactNo !== null &&
    userInput.email !== null &&
    userInput.vehicle !== null
  );
};

export const validateLogIn = (email, password) => {
  return email !== null && password !== null;
};

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
