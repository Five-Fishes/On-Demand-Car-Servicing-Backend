import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from "apollo-server-express";
import validator from "email-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { User } from "../models";
import {
  validateLogIn,
  validateSignUp,
  validateRole,
} from "../utils/validator";
import { passwordEncryptor } from "../utils/encryption";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      type: user.type,
      employeeType: user.employeeType,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "31536000000", // 1 year in millis
    }
  );
};

const UserResolver = {
  Query: {
    users: async (root, { filter }, context, info) => {
      /**
       * - check null filter
       * - parse filter if not null
       * - find by filter
       */

      if (filter === null) {
        throw new UserInputError("No filter provided, use {} to get all");
      }

      /**
       * Generate filter fron string
       */
      const parsedFilter = JSON.parse(filter);

      /**
       * Search with filter
       */
      const filteredUsers = await User.find(parsedFilter);

      return filteredUsers;
    },
    user: async (root, { id }, context, info) => {
      /**
       * - check null id
       * - validate mongoose id
       * - find by id
       */
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new UserInputError(`${id} is not a valid user ID`);
        }

        const user = await User.findById(id);
        return user;
      }
    },
  },
  Mutation: {
    login: async (root, { email, password }, context, info) => {
      /**
       * - validate login input
       * - compare password
       * - return user with token
       */
      const isLoginInputValid = validateLogIn(email, password);
      if (!isLoginInputValid) {
        throw UserInputError("Login Input incomplete");
      }

      /**
       * validate email format
       */
      const isEmailValid = validator.validate(email);
      if (!isEmailValid) {
        throw new ApolloError("Invalid Email", 500);
      }

      /**
       * check if any existing user with provided email
       */
      let user = await User.findOne({ email: email });
      if (!user) {
        throw ApolloError("Email not found");
      }

      /**
       * compare password
       */
      const isPasswordSame = await bcrypt.compare(password, user.password);
      if (!isPasswordSame) {
        throw AuthenticationError("Wrong Password");
      }

      /**
       * generate jwt
       */
      const token = generateToken(user);

      user.token = token;

      return user;
    },
    signUp: async (root, { userInput }, context, info) => {
      /**
       * - check email format
       * - check user exist, by email
       * - encrypt password
       * - add user
       * - generate jwt
       */

      /**
       * Validate overall user signup input
       */
      const isValidInput = validateSignUp(userInput);
      if (!isValidInput) {
        throw new UserInputError(
          "User input contains null in non nullable field"
        );
      }

      /**
       * User role checking:
       * 1. CUSTOMER and BRANDOWNER cannot have EmployeeType
       * 2. EMPLOYEE must have EmployeeType
       */
      const isRoleValid = validateRole(userInput);
      if (!isRoleValid) {
        throw new UserInputError("Invalid user type and employee type pairs");
      }

      /**
       * Check email validity
       */
      const isEmailValid = validator.validate(userInput.email);
      if (!isEmailValid) {
        throw new ApolloError("Invalid Email", 500);
      }

      /**
       * Check is email taken
       */
      const isEmailTaken = await User.findOne({
        email: userInput.email,
      });
      if (isEmailTaken) {
        throw new ApolloError("Email Already Taken", 500);
      }

      /**
       * Encrypt user password
       */
      const encryptedPassword = await passwordEncryptor(userInput.password);

      /**
       * Add user with model
       */
      let newUser = { ...userInput };
      newUser.password = encryptedPassword;
      let createdUser = await User.create(newUser);

      /**
       * Generate JWT Token
       * Add the token to payload
       */
      const jwtToken = generateToken(createdUser);
      createdUser.token = jwtToken;

      return createdUser;
    },
    updateUser: async (root, { userInput }, context, info) => {
      /**
       * - check is user id null
       * - check mongoose id validity
       * - check the validity of:
       *    - email
       *    - role
       * - check is user trying to update password from here
       * - update user info
       */

      if (userInput.id === null) {
        throw UserInputError("No User ID provided to update");
      }

      if (!mongoose.Types.ObjectId.isValid(userInput.id)) {
        throw new UserInputError(`${userInput.id} is not a valid user ID`);
      }

      /**
       * Check email validity
       */
      const isEmailValid = validator.validate(userInput.email);
      if (!isEmailValid) {
        throw new ApolloError("Invalid Email", 500);
      }

      /**
       * Check is email taken by others
       */
      const existingUser = await User.findOne({
        email: userInput.email,
      });
      if (existingUser && existingUser.id !== userInput.id) {
        throw new ApolloError("Email Already Taken", 500);
      }

      /**
       * User role checking:
       * 1. CUSTOMER and BRANDOWNER cannot have EmployeeType
       * 2. EMPLOYEE must have EmployeeType
       */
      const isRoleValid = validateRole(userInput);
      if (!isRoleValid) {
        throw new UserInputError("Invalid user type and employee type pairs");
      }

      /**
       * - disallow user to update password from here
       * - reassign password if proceed to avoid overwriting existing hashed password
       */
      const isPasswordSame = await bcrypt.compare(
        userInput.password,
        existingUser.password
      );
      if (!isPasswordSame) {
        throw new UserInputError(
          "Invalid attempt to update password via this mutation"
        );
      }
      let newUserDetails = { ...userInput };
      newUserDetails.password = existingUser.password;

      const updatedUser = await User.findByIdAndUpdate(
        userInput.id,
        newUserDetails,
        { new: true }
      );

      return updatedUser;
    },
    deleteUser: async (root, { userId }, context, info) => {
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new UserInputError(`${userId} is not a valid user ID`);
        }
        /**
         * Check for authorisation to delete
         */
        try {
          const deletedUser = await User.findOneAndDelete({ _id: userId });
          return deletedUser;
        } catch (error) {
          throw ApolloError(`Error deleting User with ID: ${userId}`, 500);
        }
      } else {
        throw UserInputError("No Id provided");
      }
    },
  },
};

export default UserResolver;
