const schedule = require('node-schedule')
const { Statistics } = require('../app/models/statistics')

function scheduleStatistics(){
    schedule.scheduleJob('1 * * * * *', async function(){
        const strTime = Statistics.getStrTime()
        await Statistics.findOrCreate({
            where: {
                date: strTime
            }
        })
    }); 
}

module.exports = {
    scheduleStatistics
}