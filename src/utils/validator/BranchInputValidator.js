import { Service } from "../../models";

/**
 * validate ids provided are existing services
 * @param {Array} services
 */
export const servicesValidator = async (services) => {
  let errors = [];
  for (const serviceId of services) {
    try {
      const available = await Service.findById(serviceId);
    } catch (error) {
      errors.push(`${serviceId} is Invalid`);
    }
  }
  const isAllValid = errors.length === 0;
  return [isAllValid, errors];
};
