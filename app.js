const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require('path')
const cors = require('cors')

const PORT = config.get('port') || 5000
const MONGO_URI = config.get('mongoURI')

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }, () => console.log('Connected to Mongodb'))
  } catch (error) {
    console.log('Server error', error.message)
    process.exit({code: 1})
  }
}

const app = express()
// app.use(cors())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV=production) {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


start()

app.listen(PORT, () => console.log(`App runs on port ${PORT}...`))