import { User } from "../models/user.models.js";
import { CustomError } from "../utils/customeError.js"

export const createUser = async (data) => {

    console.log(data);

    try {

        // * create user and return user without password

        const existingUser = await User.findOne({ email: data.email })

        if (existingUser) {
            throw new CustomError("User Already Exist with this Email", 409);
        }

        const response = await User.create(data);
        return response;

    } catch (error) {

        console.error("ERROR - User Creation Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while user creating", 503);
    }

}


export const updateUser = async (userId, data) => {

    console.log(data);

    try {

        // * create user and return user without password

        // const updatedUser = await User.findByIdAndUpdate(userId, data, {
        //     new: true,
        //     runValidators: true,
        // })

        const updatedUser = await User.findOneAndUpdate({userId}, data, {
            new: true,
            runValidators: true,
        })

        if (!updatedUser) {
            throw new CustomError("User Not Exist with this ID", 404);
        }

        return updatedUser;

    } catch (error) {

        console.error("ERROR - User Updating Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while updating user", 500);
    }

}


export const getUserByUserId = async (userId) => {

    try {

        // * create user and return user without password

        const user = await User.findOne({ userId })

        if (!user) {
            throw new CustomError("User Not Exist with this ID", 404);
        }

        return user;

    } catch (error) {

        console.error("ERROR - User Getting Failure", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while getting user", 500);
    }
}

export const getUserByEmail = async (email) => {

    try {

        // * create user and return user without password

        const user = await User.findOne({ email })

        if (!user) {
            throw new CustomError("User Not Exist with this Email", 404);
        }

        return user;

    } catch (error) {

        console.error("ERROR - User Getting Failure", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while getting user", 500);
    }
}




















