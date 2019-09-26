/*
 * @Author: Khoayenn 
 * @Date: 2019-08-11 15:24:27 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-13 12:23:29
 */
const User = require("../models/user.model");
const Boom = require("@hapi/boom");
const urljoin = require('url-join');
const randomstring = require("randomstring");
const CustomResponse = require("../commons/response")
const CustomError = require("../commons/error")
const authService = require("../services/auth.service");
const mail = require("../constant").mail
const message = require("../constant").message
const role = require("../constant").role
const {paginate} = require("../services/pagination")
const userOption = require("../constant").user
const {getPhotoPath} = require("../services/upload");
const { sendCode } = require("../services/mail.service")
const SCHEME = process.env.SCHEME;
const HOST = process.env.HOST;
const PORT = process.env.PORT;

async function findUser(req, res, next, id){
    try {
        const userId = id;
        const foundUser = await User.findOne({_id: userId});
        if(foundUser){
            req.foundUser = foundUser;
            next();
        }
        else{
            const userNotFound =  Boom.notFound(message.userNotFound).output;
            throw new CustomError({
                statusCode: userNotFound.statusCode,
                error: userNotFound.payload
            })
        }
    } catch (error) {
        next(error);
    }
}
async function createUser(req, res, next) {
    try {
        await User.findOne({
            email: req.body.email
        }).then(result => {
            if(result) {
                const existedAccount = Boom.badData(message.registeredEmail).output;
                throw new CustomError({
                    statusCode: existedAccount.statusCode,
                    error: existedAccount.payload
                });
            }
        })

        await User.findOne({
            phoneNumber: req.body.phoneNumber
        }).then(result => {
            if(result){
                const registeredNumber = Boom.badData(message.registeredPhoneNumber).output;
                throw new CustomError({
                    statusCode: registeredNumber.statusCode,
                    error: registeredNumber.payload
                });
            }
        })

        const newUser = new User(req.body);
        newUser.role = role[0];
        newUser.personalCode = randomstring.generate(7);
        const savedUser = await newUser.save();
        // gui mail toi email vua dang ki
        sendCode(savedUser.email, savedUser.personalCode, mail.verifyCode)
        const token = authService.createToken(savedUser._id, savedUser.email, savedUser.role)
        // const newToken = new ValidToken({userId: savedUser._id, token: token});
        // newToken.save(); //luu token vao db  //, token: token
        new CustomResponse({
            statusCode: 200,
            result: {user: newUser.transform()}
        }).return(res);

    } catch (err) {
        next(err);
    }
}
/* role[0]: user , role[1]: admin */
async function getUser(req, res, next) {
    try {
        if (req.user.role === role[0]) {
            const foundUser = await User.findOne({
                _id: req.user.id
            });
            if (foundUser) {
                new CustomResponse({
                    statusCode: 200,
                    result: foundUser.transform()
                }).return(res);
            } else {
                const userNotFound = Boom.notFound(message.userNotFound).output;
                throw new CustomError({
                    statusCode: userNotFound.statusCode,
                    error: userNotFound.payload
                });
            }
        }
        else if (req.user.role === role[1]) {
            let page = 1;
            if (req.query.page> 1) {
                page = req.query.page;
            }
            let query = {
                role: role[0]
            };
            if (req.query.id) {
                query._id = req.query.id;
            }
            const users = await paginate(User, query, userOption.perPage, page, {
                createdAt: -1
            });
            new CustomResponse({
                statusCode: 200,
                result: users
            }).return(res)
        }
    } catch (error) {
        next(error)
    }
}

async function updateUser(req, res, next) {
    try {
        const updatedUser = await User.findOneAndUpdate({
            _id: req.user.id
        }, req.body, {
            new: true
        });
        new CustomResponse({
            statusCode: 200,
            result: updatedUser.transform()
        }).return(res);

    } catch (err) {
        next(err)
    }
}

async function updateAvatar(req, res, next) {
    try {
        const imagePath = await getPhotoPath(req);
        if (!imagePath) {
            const noFileChosen = Boom.badData(message.noFileChosen).output;
            throw new CustomError({
                statusCode: noFileChosen.statusCode,
                error: noFileChosen.payload
            });
        }
       
        const user = await User.findOneAndUpdate({
            _id: req.user.id
        }, {
            avatar: imagePath
        }, {
            new: true
        })
        new CustomResponse({
            statusCode: 200,
            result:  urljoin(SCHEME + HOST + ":" + PORT, imagePath)
        }).return(res)

    } catch (error) {
        next(error)
    }
}

async function verify(req, res, next){
    try {
        const { code, email} = req.body;
        if(!code){
            const emptyPersonalCode = Boom.badData(message.emptyPersonalCode).output;
            throw new CustomError({statusCode: emptyPersonalCode.statusCode, error: emptyPersonalCode.payload})
            
        }
        else{
            const foundUser = await User.findOne({email: email});
            if(foundUser){
                if(foundUser.isVerified)
                {
                    const verifiedUser = Boom.badRequest(message.verifiedUser).output;
                    throw new CustomError({statusCode: verifiedUser.statusCode, error: verifiedUser.payload})
                    
                }
                else if(!foundUser.isVerified && foundUser.personalCode===code){
                    foundUser.isVerified = true;
                    await foundUser.save();
                    new CustomResponse({statusCode:200, result: message.successVerifiedUser}).return(res);

                }
                else{
                    const invalidCode = Boom.badData(message.invalidPersonalCode).output;
                    throw new CustomError({statusCode: invalidCode.statusCode, error: invalidCode.payload})
            
                }
            }else{
                let userNotFound = Boom.notFound(message.userNotFound).output;
                throw new CustomError({statusCode: userNotFound.statusCode, error: userNotFound.payload})
            }
        }
    } catch (error) {
        next(error)
    }
}

async function forgetPassword(req, res, next){
    try {
        const { email } = req.body;
        const foundUser = await User.findOne({email: email});
        if(foundUser){
            sendCode(foundUser.email, foundUser.personalCode, mail.forgetPassCode);
            new CustomResponse({statusCode: 200, result: message.forgetPasswordMailSent}).return(res);

        }
        else{
            const notFoundUser = Boom.notFound(message.userNotFound).output;
            throw new CustomError({statusCode: notFoundUser.statusCode, error: notFoundUser.payload});

        }
        
    } catch (error) {
        next(error)
    }
}

async function changePassword(req, res, next){
    try {
        const { email, code, newPassword } = req.body;
        const foundUser = await User.findOne({email: email});
        if(foundUser){
            if(foundUser.personalCode === code ){
                foundUser.password = newPassword;
                //tao personal code moi
                foundUser.personalCode = randomstring.generate(7);
                foundUser.save();
                new CustomResponse({statusCode: 200, result: message.changePassSuccess}).return(res);

            }else{
                const invalidCode = Boom.badData(message.invalidPersonalCode).output;
                throw new CustomError({statusCode: invalidCode.statusCode, error: invalidCode.payload})
            
            }
        }
        else{
            const notFoundUser = Boom.notFound(message.userNotFound).output;
            throw new CustomError({statusCode: notFoundUser.statusCode, error: notFoundUser.payload});

        }
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createUser,
    getUser,
    updateUser,
    updateAvatar,
    verify,
    forgetPassword,
    changePassword,
    findUser
};