module.exports = {
    gender: ["male", "female"],
    role: ["user", "admin"],
    validRole: ["user"],
    message: {
        logout: "User logged out",
        successfullyLogout: "Successfully log out",
        removeTokens: "All tokens are destroyed",
        wrongPassword: "Wrong password",
        postSuccessfullyDeleted: "Post successfully deleted",
        ratingSuccessfullyDeleted: "Rating successfully deleted",
        invalidToken: "Invalid Token - Please sign in to get token",
        noRight: "No right to access",
        userNotFound: "User not found",
        postNotFound: "Post not found",
        ratingNotFound: "Rating not found",
        registeredEmail: "Email was registered",
        registeredPhoneNumber: "Phone number was registered",
        noFileChosen: "No file chosen",
        wrongImageFormat: "Invalid image format",
        notAllowedCreatingPost: "You're not allowed to create new post",
        deactiveAccount: "Your account is not available",
        activeAccount: "Your account is active",
        invalidPersonalCode: "Please use the valid code",
        emptyPersonalCode: "Please enter your code",
        accountSuccessDeleted: "Account is successfully deleted",
        verifiedUser: "Your account was verified",    
        successVerifiedUser: "Your account is verified",
        changePassSuccess: "Password successfully changed",
        forgetPasswordMailSent: "Please check your email to get the way to change password",
        invalidObjectId: "Object Id is invalid"     
    },
    joiMessage:{
        required: "is required",
        email: "must be valid email",
        min: "must be at least {{limit}} characters",
        max: "must be less than {{limit}} characters",
        length: "must be {{limit}} character length",
        regex: "must match the format"

    },
    user: {
        perPage: 5
    },
    post: { 
        perPage: 10
    },
    rating: {
        perPage: 10
    },
    mail:{
        verifyCode: "<p>Your personal code: </p>" + "<h2>",
        forgetPassCode: "<p>Use this code to confirm to change your password.</p>"
        + "<p style='color: red'>Don't let anyone know your code, keep it private.</p>"
        + "<p>Click <a href='#'>here</a> to change password</p>"
        + "<p>Your personal code: </p>" + "<h2>"
    }

};


/*

*/