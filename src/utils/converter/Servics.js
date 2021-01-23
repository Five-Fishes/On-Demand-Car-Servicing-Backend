/**
 * Convert mongoose Decimal128 to graphql Float
 * @param {Object} service
 */
export const estimatedServiceTimeConverter = (service) => {
  service._doc.estimatedServiceTime = service._doc.estimatedServiceTime.toString();
  return service;
};
