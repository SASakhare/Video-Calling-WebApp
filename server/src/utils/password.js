import * as argon2 from "argon2"



export const hashPassword = async (password) => {

    return await argon2.hash(password);
}



export const verifyPassword = async (hash_password, password) => {
    return await argon2.verify(hash_password, password)
}




















