export class CustomError extends Error {
    constructor(message, statusCode) {
        super(message); // Pass the text message to the native parent Error class
        this.statusCode = statusCode; // Attach your custom HTTP status code
        this.isOperational = true; // Flags this as a known app error, not a system crash

        Error.captureStackTrace(this, this.constructor); // Cleans up the debug log stack trace
    }
}
