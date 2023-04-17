const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    content: {
        type: String,
        required: true,
        maxLength: 2000
    }
})

const Announcement = mongoose.model("Announcement", announcementSchema)

module.exports = { Announcement }
