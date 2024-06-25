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
const task = require('./controllers/Projects/Graphic_design/projects_task_scheduler')
const projects = require('./models/graphic-design-model')
const User = require('./models/UsersLogin')

const PORT = process.env.PORT
//App Config
ConnectDB()

// const addProjectCategorytoProjectNotifications = async () => {
//     try {
//         const users = await User.find().lean()
//         if (users.length > 0) {

//             for (let i = 0; i < users.length; i++) {
//                 console.log('working')
//                 const findSingleUser = await User.findById(users[i]._id)
//                 if (findSingleUser.project_notifications.length > 0) {
//                     const project_notifications = findSingleUser.project_notifications
//                     for (let j = 0; j < project_notifications.length; j++) {
//                         // const current_notification = project_notifications[j]
//                         if (!project_notifications[j].hasOwnProperty('project_categroy')) {
//                             const find_project = await projects.findById(project_notifications[j].project_id)
//                             if (find_project) {
//                                 if (find_project.project_category === 'Graphic Design' || find_project.project_category === 'graphic-design') {
//                                     console.log('graphic-design')
//                                     findSingleUser.project_notifications[j].project_category = 'graphic-design'
//                                     console.log(findSingleUser.project_notifications[j].project_category)
//                                     await findSingleUser.save()
//                                 }
//                                 if (find_project.project_category === 'mobile-app-development') {
//                                     console.log('mobile-app-developmen')
//                                     findSingleUser.project_notifications[j].project_category = 'mobile-app-developmen'
//                                     await findSingleUser.save()
//                                 }
//                             } else {
//                                 continue
//                             }
//                         } else {
//                             console.log('Already has project_category')
//                             continue
//                         }
//                     }
//                 }
//             }
//         }
//     } catch (err) {
//         console.log('Error in addProjectCategorytoProjectNotifications')
//         throw err

//     }
// }

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
        // task.start() 
        // addProjectCategorytoProjectNotifications()
    })
})
mongoose.connection.on('error', error => {
    console.log(error)
    logEvents(error.no + ' : ' + error.code + '\t' + error.syscall + '\t' + error.hostname, 'mongoErrorLog.log')
})