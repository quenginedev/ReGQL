import initServer from './server'
import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/houser', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('open', ()=>{
    initServer()
})
