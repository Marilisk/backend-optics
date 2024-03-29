

export class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }


    static UnauthorisedError() {
        return new ApiError(401, 'User s not authorised');
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

}


//export default new ApiError();