const jwt = require('jsonwebtoken')

function parseCookies (request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

const requireAuth = (req,res,next) =>{
    const cookies = parseCookies(req);
    const token = cookies.jwt;
    
    //check json web token exists & is verified
    if(token){
        jwt.verify(token, 'B airways secret', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/')
    }
}

//check current user
const checkUser = (req,res,next) =>{
    const cookies = parseCookies(req);
    const token = cookies.jwt;

    //check json web token exists & is verified
    if(token){
        jwt.verify(token, 'B airways secret', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                req.user = null;
                next();
            }else{
                console.log(decodedToken);
                let userId = decodedToken.id;
                let userType = decodedToken.userType; 
                req.user = {id: userId, userType: userType};
                next();
            }
        })
    }else{
        req.user = null;
        next();
    }
}

module.exports = {
    requireAuth,
    checkUser
}