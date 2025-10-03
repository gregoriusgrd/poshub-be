import { conflict, forbidden } from "../../../core/errors/http-error"
import { EC } from "../../../core/errors/error-codes"

// Error when user provides invalid email or password during login

export const invalidCredentialsError = () => {
    forbidden("Invalid email or password", EC.INVALID_CREDENTIALS)
}

// Error when trying to register a user with an email that already exists

export const userAlreadyExistsError = () => {
    conflict("User with this email already exists", EC.USER_ALREADY_EXISTS)
}