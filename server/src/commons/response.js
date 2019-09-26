class CustomResponse {
    constructor({statusCode, result}) {
        this.statusCode = statusCode,
        this.result = result       
    }
    return(res){
        res.status(this.statusCode).json(this);
    }
}

module.exports = CustomResponse;