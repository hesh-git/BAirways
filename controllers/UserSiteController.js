const Profile = require("../models/ProfileModel");

const view_profile_get = (req, res) => {
    res.render('./reg_user/user_profile', {title: 'user | Profile', layout: './layouts/user_layout'});
}

const view_dashboard_get = (req, res) => {
    res.render('./reg_user/user_dashboard', {title: 'user | Dashboard', layout: './layouts/user_layout'});
}

module.exports = {
    view_profile_get,
    view_dashboard_get

}
