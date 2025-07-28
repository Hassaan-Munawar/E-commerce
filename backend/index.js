import express from 'express';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hi World!');
})



app.listen(3000, () => console.log("Server is running on PORT " + 3000));
