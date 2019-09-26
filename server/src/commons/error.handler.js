const CustomError = require("./error")

function notFoundErr(req, res, next){
    const err = new CustomError({statusCode: 404, error: 'Page not found'})
    next(err)
}
function errHandler(err, req, res, next){
        console.log(err);
    if(err instanceof CustomError){
        res.status(err.statusCode).json(err);
    }
    else{
        res.status(500).json(new CustomError({statusCode: 500, error: "Server error"}));
    }
}

module.exports = { errHandler, notFoundErr }

