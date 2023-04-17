const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: mongoose.Schema.Types.ObjectID,
    receiver: mongoose.Schema.Types.ObjectID,
    message: String

});

const ConversationSchema = new mongoose.Schema({
    people: {
        type: [mongoose.Schema.Types.ObjectID], 
        required: true
    },
    messageHistory: {
        type: [messageSchema],
        required: true
    }
})

const Conversation = mongoose.model("Conversation", ConversationSchema)

module.exports = { Conversation }