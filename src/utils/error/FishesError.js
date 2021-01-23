import { ApolloError } from "apollo-server";

import { INVALID_FILTER_CODE } from "../../constants";

/**
 * This class is custome class that enable capturing filter parsing problem in this system
 */
export class FFInvalidFilterError extends ApolloError {
  constructor(message, details) {
    super(message, INVALID_FILTER_CODE, { Details: details });
  }
}
