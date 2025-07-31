const jwt=require('jsonwebtoken')

const adminMiddleware=async(req,res,next)=>{

   const authHeader=req.headers.authorization;

   if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({error:"not token provided"})
   }

    const token=authHeader.split(" ")[1];

    try {

        const decoded=jwt.verify(token,process.env.ADMIN_JWT_SECRET)
        req.adminId=decoded.id;
        next()
        
    } catch (error) {
        console.log("invalid token or expired token "+ error)
        res.status(500).json({error:"inavlid token or expired"})
        
    }
}

module.exports=adminMiddleware