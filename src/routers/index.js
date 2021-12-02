const consultantRouter = require('./consultantRouter');


module.exports = app => {
    app.use('/consultant', consultantRouter)
}