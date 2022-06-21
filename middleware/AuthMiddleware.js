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
    console.log("requireAuth");
    const cookies = parseCookies(req);
    const token = cookies.jwt;
    
    //check json web token exixts & is verified
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

module.exports = {
    requireAuth
}