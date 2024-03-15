const mongoose = require('mongoose')
// Old String
// mongodb+srv://heroappman:63ko69NRhaRmQVdN@cluster-mi-banana.qtlcdaf.mongodb.net/Mi-Banana-database?retryWrites=true&w=majority

// New String
// mongodb+srv://mibanana:F0GLmBdleUZ5Mq9M@mibananacluster.cva0t3g.mongodb.net/?retryWrites=true&w=majority&appName=mibananaCluster
const ConnectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://mibanana:F0GLmBdleUZ5Mq9M@mibananacluster.cva0t3g.mongodb.net/mibanana-database?retryWrites=true&w=majority&appName=mibananaCluster')
    } catch (error) {
       console.log(error) 
    }
}

module.exports = ConnectDB