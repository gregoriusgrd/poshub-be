import { forbidden } from "../../../core/errors/http-error"
import { EC } from "../../../core/errors/error-codes"

// Error when user provides invalid username or password during login

export const invalidCredentialsError = () => {
    forbidden("Invalid username or password", EC.INVALID_CREDENTIALS)
}