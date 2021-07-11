import cluster from 'cluster';

export const logPID = async (req, res, next) => {
    console.log("PID: " + cluster.worker.process.pid);
    next();
}