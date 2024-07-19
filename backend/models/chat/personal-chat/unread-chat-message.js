const moongoose = require('mongoose');

const UnreadMsgSchema = new moongoose.Schema({
    user_id: {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    unread_message: [{
        type: Object,
        default: [],
        required: false
    }]
},
    { timestamps: true }
);
module.exports = moongoose.model('UnreadMsg', UnreadMsgSchema);