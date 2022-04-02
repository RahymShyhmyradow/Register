const jwt=require('jsonwebtoken')
module.exports={
    validateRegister:(req, res, next)=>{
        if (!req.body.username || req.body.username.length<3){
            return res.status(400).send({
                message:'Please enter a username with min 3 chars'
            })
        }

        if (!req.body.password || req.body.password.length<6){
            return res.status(400).send({
                message:'Please enter a password with min 6 chars'
            })
        }

        if (!req.body.password_repeat || req.body.password!=req.body.password_repeat){
            return res.status(400).send({
                message:'Both password must match'
            })
        }
        next()
    },
    isLoggedIn:(req, res, next)=>{
        try {
            const authHeader=req.headers.authorization;
            if (!authHeader){
                return res.status(400).send({
                    message:'Your session is not valid'    
                })
            }
            const token=authHeader.split(' ')[1];
            const decoded=jwt.verify(token, 'SECRETKEY')
            req.userData=decoded;
            next();
        } catch (err) {
            throw err;
            res.status(400).send({
                message:'Your session is not valid'
            })
        }
    }
}