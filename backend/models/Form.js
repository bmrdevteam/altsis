const mongoose = require('mongoose')
const moment = require('moment');
const { conn } = require('../databases/connection')

const formSchema = mongoose.Schema(
    {
        userId: String,
        userName: String,
        schoolId: String,
        form: String,
        header: Object,
        data: Array,
        timestamps: {
            type: String,
            default: moment().format('YYYY-MM-DD HH:mm:ss')
        }
    })

module.exports = (dbName) => {
    return conn[dbName].model('Form', formSchema);
}