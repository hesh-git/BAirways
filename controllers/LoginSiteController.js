const login_page = (req,res) => {
    res.render('login', {title: 'Login Page'})
}

module.exports = {
    login_page
}