const flightTimeTable_get = (req, res) => {
    res.render('flightSheduleTimeTable', {title : 'Flight Shedules'});
}

module.exports = {
    flightTimeTable_get
}