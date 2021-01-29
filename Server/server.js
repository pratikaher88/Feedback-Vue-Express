const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let responses = [];


app.post('/api/feedbackresponse', (req, res) => {
    const feedbackresponse = req.body;

    console.log(feedbackresponse);
    responses.push(feedbackresponse);

    res.send('Response is recieved!');
});

app.get('/api/responses', (req, res) => {
    console.log("Recieved response",responses)
    res.json(responses);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

