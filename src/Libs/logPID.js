import cluster from 'cluster';

export const logPID = async (req, res, next) => {
    console.info("PID: " + cluster.worker.process.pid);
    next();
}