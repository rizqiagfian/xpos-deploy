const express = require("express")
const app = express()
const PORT = process.env.PORT || 8088
const bodyParser = require("body-parser")
global.config = require('./configure/config')
const cors = require("cors")

const corsOptions = {
    origin: ["http://localhost:8081", '*']
}

app.use(cors(corsOptions))
app.use(express.static('upload'))

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//     res.header("Access-Control-Allow-Method", "PUT, POST, GET, DELETE")
//     next()
// })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./service/categoryService')(app, global.config.pool)
require('./service/variantService')(app, global.config.pool)
require('./service/productService')(app, global.config.pool)
require('./service/catalogService')(app, global.config.pool)
require('./service/historyService')(app, global.config.pool)
require('./service/userService')(app, global.config.pool)

app.get('/', (req, res) => {

    res.status(200).send("Welcome to api backend xpos")
})

// app.post('/datapost', (req, res) => {
//     console.log(req.body)

//     res.status(200).send('data successfuly sent')
// })

app.listen(PORT, () => {
    console.log(`Application is running on port : ${PORT}`);
})