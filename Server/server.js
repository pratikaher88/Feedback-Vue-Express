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
    // var final = []
    // for(var res in responses){
    //     var result = {}
    //     for(var value in responses[res]){
    //         var data = responses[res][value]
    //         var key = Object.keys(data)[0]
    //         result[key] = data[key]
    //     }
    //     final.push(result)
    // }
    // console.log(final);
    res.json(responses);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

