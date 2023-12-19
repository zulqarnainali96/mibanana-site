require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ConnectDB = require('./config/DbConfig')
const cors = require('cors')
const { logger } = require('./middleware/logs')
const corsOptions = require('./config/corsOptions')
const { logEvents } = require('./middleware/logs')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const path = require('path')

const PORT = process.env.PORT
//App Config
ConnectDB()
app.use(cors(corsOptions))
app.use(logger)
app.use(cookieParser())
app.use(express.json())
app.use('/', require('./routes/routes'))
app.use('/authentication/mi-sign-in', require('./routes/loginRoutes'))
app.use('/authentication/mi-sign-up', require('./routes/userRoutes'))
app.get('/test', (req, res) => {
    res.send("Working")
})
app.use(errorHandler)
mongoose.connection.once('open', () => {
    console.log(`Connected to MongoDB`)
    app.listen(PORT, () => {
        console.log(`Server started on Port : ${PORT}`)
    })
})
mongoose.connection.on('error', error => {
    console.log(error)
    logEvents(error.no + ' : ' + error.code + '\t' + error.syscall + '\t' + error.hostname, 'mongoErrorLog.log')
})