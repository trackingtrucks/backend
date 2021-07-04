const cron = require('cron')
const Pusher = require('pusher')
const adm = require('firebase-admin')
const { v4 } = require('uuid');

var actualCronJobs = {}

var dayTable = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

const pusher = new Pusher({
    //credenciales de pusher dea (aca iria sockets)
});

function triggerClass(body, id){
    console.log("Triggered class with subject", body.subject, 'from', body.hierarchy)
    pusher.trigger('TIClass', 'incomingClass', body)
    if(!body.repeat){
        delete actualCronJobs[id]
        const db = adm.firestore()
        db.collection('clases').doc(id).delete()
    }
}

function tenMinLess(hour, minute){
    minute -= 10
    if(Math.sign(minute)== -1){
        minute = 60 + minute
        hour -= 1
    }
    return [minute, hour]
}

function repeatRoutine(body, id) {
    var [hour, minute, weekDay] = body.date.split('/')
    var [minuteNew, hourNew] = tenMinLess(parseInt(hour), parseInt(minute))
    var cronDate = `01 ${minuteNew} ${hourNew} * * ${weekDay}`
    
    var job = new cron.CronJob(cronDate, ()=>triggerClass(body, id),undefined, true, "America/Argentina/Buenos_Aires")
    job.start()
    actualCronJobs[id] = {
        cronJob: job,
        data: body
    }
    console.log("Event start:", actualCronJobs[id].data.subject, `from ${body.hierarchy}, date ${hourNew}:${minuteNew} every ${dayTable[weekDay]}`)
}


function uniqueRoutine(body, id) {
    var [hour, minute, day, month] = body.date.split('/')
    var [hourNew, minuteNew] = tenMinLess(parseInt(hour), parseInt(minute))
    var monthP = parseInt(month) - 1
    var cronDate = `01 ${minuteNew} ${hourNew} ${day} ${monthP} *`
    var job = new cron.CronJob(cronDate, ()=>triggerClass(body, id),undefined, true, "America/Argentina/Buenos_Aires")
    job.start()
    actualCronJobs[id] = {
        cronJob: job,
        data: body
    }
    console.log("Event start:", actualCronJobs[id].data.subject, `from ${body.hierarchy}, date ${hourNew}:${minuteNew} ${day}/${monthP}`)

}

module.exports = {
    main() {
        const db = adm.firestore()
        db.collection('classes').get()
        .then((sn) => {
            sn.forEach(doc => {
                var data = doc.data()
                var id = doc.id
                if (data.date) {
                    var { repeat } = data
                    if (repeat) repeatRoutine(data, id)
                    else uniqueRoutine(data, id)
                }
            })
        })
        .catch(error => {
            console.log({ msgError: true, msgBody: error })
        })
    },
    createRoutine(body, id) {
        var { repeat } = body
        if (repeat) repeatRoutine(body, id)
        else uniqueRoutine(body, id)
    },
    cronJobs() {
        var arr = {}
        for (var k in actualCronJobs) {
            var data = actualCronJobs[k].data
            arr[k] = {
                running: actualCronJobs[k].cronJob.running,
                data
            }
        }
        return arr
    },
    testRoutine() {
        var id = v4()
        console.log(id)
        var i = 0
        var job = new cron.CronJob("*/5 19 4 * * *", () => {
            i++
            console.log(i)
        })
        job.start()
        actualCronJobs[id] = {
            cronJob: job
        }
        return "godines"
    },
    stopRoutine(id, del) {
        var data = actualCronJobs[id]
        if (data) {
            if (data.cronJob.running) {
                data.cronJob.stop()
                delete actualCronJobs[id]
                console.log("Stopped routine", data.data.subject, "from", data.data.hierarchy)
                return "Atroden"
            }
            else return "This routine is actually stopped"
        } else return "There is no routine with that ID"
    },
    startRoutine(id) {
        var data = actualCronJobs[id]
        if (data) {
            if (!data.cronJob.running) {
                data.cronJob.start()
                return "Atroden"
            }
            else return "This routine is actually stopped"
        } else return "There is no routine with that ID"
    }
}