const schedule = require('node-schedule')
const { Statistics } = require('../app/models/statistics')

function scheduleCronstyle(){
    schedule.scheduleJob('1 * * * * *', async function(){
        const strTime = Statistics.getStrTime()
        const time = await Statistics.findOrCreate({
            where: {
                date: strTime
            }
        })
        console.log(time)
    }); 
}

module.exports = {
    scheduleCronstyle
}