const mongoose = require('mongoose')

const ConnectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://mibanana:F0GLmBdleUZ5Mq9M@mibananacluster.cva0t3g.mongodb.net/mibanana-database?retryWrites=true&w=majority&appName=mibananaCluster')
    } catch (error) {
       console.log(error) 
    }
}

module.exports = ConnectDB  