const path = require('path');
require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT || 6000

const app = express();
const authRoutes = require('./routes/auth');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
app.use('/api-documents', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    explorer: true,
    swaggerOptions: {
        displayRequestDuration: true
    }
}));
app.get('/swagger', (req, res) => {
    fs.readFile("./swagger_output.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
        }
        try {
            const customer = JSON.parse(jsonString);

            res.status(200).send(customer);
        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
    });
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

app.listen(PORT, () => {
    console.log(`application started on port ${PORT}`)
})