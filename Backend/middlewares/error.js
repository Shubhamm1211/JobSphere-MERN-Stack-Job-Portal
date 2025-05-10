class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);  // we are calling constructor of error class by the help of super .
        this.statusCode=statusCode;
    }
}

//creating middlewares for error 
export const errorMiddleware=(err,req,res,next)=>{
    //if no message error comes -> its code is 500
    err.message=err.message || "Internal Server error";
    err.statusCode=err.statusCode || 500;

    //handling some errors with there error name 
    if(err.name==="CaseError"){
        const message=`Resource not found Invalid ${err.path}`;
        err=new ErrorHandler(message,400);//creating new error
    }
    //if false mail validation than 11000 error return , like mail already registered -> duplicate 
    if(err.code===11000){    // database error
        const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
        err=new ErrorHandler(message,400);
    }
    if(err.name==="JsonWebTokenError"){
        const message=`Json web token is Invalid, Try Again`;
        err=new ErrorHandler(message,400);
    }
    if(err.name==="TokenExpiredError"){
        const message=`Json Web Token is expired. Try again.`;
        err=new ErrorHandler(message,400);
    }

    return res.status(err.statusCode).json({
        success:false,
        message: err.message,
    });

};

export default ErrorHandler;