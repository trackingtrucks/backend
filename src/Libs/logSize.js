export const logSize = async (req, res, next) => {
    // console.log(req.headers['content-length'] + "kb");
    console.log("Recibiendo request de " + '\u001b[' + 36 + 'm' + req.headers['content-length'] + '\u001b[0m' + "kb")
    next();
}