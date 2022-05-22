const flightTimeTable_get = (req, res) => {
    res.render('flightSheduleTimeTable', {title : 'Flight Shedules', layout: '.layouts/schedule_layout'});
}

module.exports = {
    flightTimeTable_get
}