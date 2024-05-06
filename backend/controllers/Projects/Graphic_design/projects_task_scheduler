const Cron = require('node-cron');
const Projects = require('../../../models/graphic-design-model');

// Task for Graphic Design Project
const task = Cron.schedule('*/10 * * * *', async () => {
    try {
        const projects = await Projects.find({ status: 'For Review' }).lean();
        if (projects) {
            for (const project of projects) {
                let date = new Date(project.updatedAt);
                const daysSinceLastUpdate = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSinceLastUpdate === 30) {
                    await Projects.findByIdAndUpdate(project._id, { status: 'Completed' })
                }
            }
        }
    } catch (error) {
        console.error('Error updating project statuses:', error);
    }
})

module.exports = task