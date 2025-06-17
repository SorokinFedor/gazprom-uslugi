require('dotenv').config()
const express = require('express')
const path = require('path')
const sequelize = require('./db')
const models = require('./models/models') 
const cors = require('cors')
const router = require('./routes/index') 
const errorHandler = require('./middleware/ErrorHandlingMiddleware') 
const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, '../client/build')))
app.use('/api', router)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        console.log('Соединение с базой данных прошло успешно.')

        await sequelize.sync()
        console.log('База данных синхронизирована.')

        app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту.`))
    } catch (e) {
        console.error('Error starting server:', e)
        process.exit(1)
    }
}

start()