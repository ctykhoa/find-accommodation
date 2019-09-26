class CustomError extends Error{
    constructor({statusCode, error}){
        super();
        this.statusCode = statusCode;
        this.error = error;   
    }
}

module.exports = CustomError;