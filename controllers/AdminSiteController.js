// dashboard

const dashboard = (req, res) => {
    res.render('./admin/admin_dashboard', {title: 'Admin | Dashboard'});
}

const add_schedule = (req, res) => {
    res.render('./admin/add_schedule', {title: 'Add | Flight Schedule'});
}

module.exports = {
    dashboard,
    add_schedule
}