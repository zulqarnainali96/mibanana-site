const mongoose = require('mongoose')


const liveDatabase = 'mongodb+srv://mibanana:F0GLmBdleUZ5Mq9M@mibananacluster.cva0t3g.mongodb.net/mibanana-database?retryWrites=true&w=majority&appName=mibananaCluster'
const testDatabase = 'mongodb+srv://mibanana:F0GLmBdleUZ5Mq9M@mibananacluster.cva0t3g.mongodb.net/test-database?retryWrites=true&w=majority&appName=mibananaCluster'


const ConnectDB = async () => {
    try {
        await mongoose.connect(liveDatabase)
    } catch (error) {
        console.log(error)
    }   
}

module.exports = ConnectDB  