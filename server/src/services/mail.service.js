const nodemailer = require("nodemailer");
const MAIL = process.env.MAIL;
const MAIL_PASS = process.env.MAIL_PASS;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL,
        pass: MAIL_PASS
    }
})

transporter.verify(function(error, success){
    if(error){
        throw error;
    }
    else{
        console.log("Email account connected")
    }
});

async function sendCode(email, code, message){
    try {
        const sentMail = transporter.sendMail({
            from: "Khoa yenn",
            to: email,
            subject: "Find accomodation service",
            html: message + code + "</h2>"
        
        })
        if(sentMail){
            console.log("mail sent")
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    sendCode
}