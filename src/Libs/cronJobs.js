import cron from 'cron';
import { sendMessage } from '../index'
import { emailTurno } from '../email'
import DataCrons from '../Models/DataCrons'
// import Tarea from '../Models/Tarea'

var actualCronJobs = {}

var dayTable = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

export async function notificarTurno({ fecha, destino }) {
    var job = new cron.CronJob(fecha, function () { emailTurno({ destino }) }, null, true)
    job.start();
}

export async function notificarTramite({fecha, destino}){
    var job = new cron.CronJob(fecha, function () { emailTramite({ destino }) })
    job.start();
}


function triggerClass(body, id) {
    console.log("Triggered class with subject", body.subject, 'from', body.hierarchy)
    pusher.trigger('TIClass', 'incomingClass', body)
    sendMessage("admins", 'message', "Hola rey!");
    if (!body.repeat) {
        delete actualCronJobs[id]

        const db = adm.firestore()
        db.collection('clases').doc(id).delete()
    }
}

function tenMinLess(hour, minute) {
    minute -= 10
    if (Math.sign(minute) == -1) {
        minute = 60 + minute
        hour -= 1
    }
    return [minute, hour]
}

function repeatRoutine(body, id) {
    var [hour, minute, weekDay] = body.date.split('/')
    var [minuteNew, hourNew] = tenMinLess(parseInt(hour), parseInt(minute))
    var cronDate = `01 ${minuteNew} ${hourNew} * * ${weekDay}`

    var job = new cron.CronJob(cronDate, () => triggerClass(body, id), undefined, true, "America/Argentina/Buenos_Aires")
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
    var job = new cron.CronJob(cronDate, () => triggerClass(body, id), undefined, true, "America/Argentina/Buenos_Aires")
    job.start()
    actualCronJobs[id] = {
        cronJob: job,
        data: body
    }
    console.log("Event start:", actualCronJobs[id].data.subject, `from ${body.hierarchy}, date ${hourNew}:${minuteNew} ${day}/${monthP}`)

}

export default {
    async fetchAll() {
        console.log("Fetching all cron jobs...");
        // const db = adm.firestore()
        // db.collection('classes').get()
        // .then((sn) => {
        //     sn.forEach(doc => {
        //         var data = doc.data()
        //         var id = doc.id
        //         if (data.date) {
        //             var { repeat } = data
        //             if (repeat) repeatRoutine(data, id)
        //             else uniqueRoutine(data, id)
        //         }
        //     })
        // })
        // .catch(error => {
        //     console.log({ msgError: true, msgBody: error })
        // })

        // const tareas = Tarea.find();
        // console.log(tareas);
        // tareas.forEach(doc => {
        //     console.log(doc);
        //     var data = doc.data;
        //     var id = doc.id;
        // })
        const crons = await DataCrons.find().populate("tramite");
        console.log(crons);

        crons.forEach(doc => {
            switch (crons.tipo) {
                case 'turno':
                    console.log(doc);
                    var fecha = doc.fecha;
                    var destino = doc.destino;
                    return notificarTurno({ fecha, destino });
                case 'tramite':
                    console.log(doc);
                    var fecha = doc.fecha;
                    var destino = doc.destino;
                    return notificarTramite({ fecha, destino });

                default:
                    break;
            }

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
        var id = Math.random();
        console.log(id)
        var i = 0
        var job = new cron.CronJob("*/5 23 15 * * *", () => {
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