
//whenever user register -> user should directly get login i.e authorized 
//token generated after user registered 

export const sendToken=(user,statusCode,res,message)=>{
    const token=user.getJWTToken();//generate token
    const options={
        expires:new Date( 
            //setting cookie expire time in days 
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly: true,
       secure:true,
       sameSite:"None",
    };
    
    //sending the response
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        message,
        token,
    });
};