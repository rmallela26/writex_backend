require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3500

connectDB()




// const fs = require('fs')
// const College = require('./models/College')
// const User = require('./models/User')
// let arr = fs.readFileSync('college_data.txt').toString('UTF8').split('\n');
// let logosArr = fs.readFileSync('college_logos.txt').toString('UTF8').split('\n');

// const createColleges = async (arr) => {
  
//     var ind = 0;

//     for (const college of arr) {
//     //   const collegeObject = { "name": name, "essays": [] };
//       const obj = JSON.parse(college)
//       const name = obj.name
//       console.log(name)
//       var essays = []
//       for (const essay of obj.essays) {
//         const essayObj = essay
//         const essayStr = `${essayObj.title}|${essayObj.required}|${essayObj.word_limit}|${essayObj.essay}`
//         essays.push(essayStr)
//       }

//       const collegeObject = { "name": name, "essays": essays, "logo": logosArr[ind] }
//       ind = ind + 1;

  
//       try {
//         await College.create(collegeObject);
//       } catch (error) {
//         console.error(`Error creating college ${name}:`, error.message);
//       }
//     }
// };

// createColleges(arr)




app.use(logger);
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))

app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/colleges', require('./routes/collegeRoutes'))


app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if(req.accepts('json')) {
        res.json({ message: "404 not found" })
    } else {
        res.type('txt').send("404 not found")
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on('error', (err) => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})