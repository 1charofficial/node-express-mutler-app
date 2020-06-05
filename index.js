const express = require('express');
const multer = require('multer')
const hbs = require('express-handlebars')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, "/uploads"))
    },
    filename: function(req, file, cb) {
      console.log("file", file)
      fileExtension = file.originalname.split(".")[1]
      cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
    },
})

const upload = multer({
    storage: storage 
})

const app = express()

app.engine('.hbs', hbs({
    defaultLayout: 'layout',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

app.use(express.static(__dirname +'/public'))
app.use(express.static(__dirname +'/uploads'))


app.get('/', (req, res)=> res.render('index'))

app.get('/uploads', (req, res) => {
    let names = fs.readdirSync(__dirname + '/uploads')
    res.render('images', {names})
})

app.post('/uploads', upload.single('myfile'), (req, res) => {
    res.redirect('/uploads')
})

app.listen(3010, ()=> {
    console.log('server is running on port 3010')
})