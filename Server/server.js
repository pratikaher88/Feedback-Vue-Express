const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/api/feedbackresponse', (req, res) => {
    const feedbackresponse = req.body;

    console.log(feedbackresponse['Comment']);

    res.send('Book is added to the database');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

