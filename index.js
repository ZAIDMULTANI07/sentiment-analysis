const express = require('express');
const tf = require('@tensorflow/tfjs');
const Sentiment = require('sentiment');

const app = express();
const port = 3000;
const sentiment = new Sentiment();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/sentiment', (req, res) => {
  const text = req.body.text;

  try {
    const result = sentiment.analyze(text);
    console.log(result);

    if (result === undefined) {
      res.send({
        sentiment: 'error',
        confidence: 0
      });
    } else {
      const score = result.score;
      let sentiment;

      if (score > 0) {
        sentiment = 'positive';
      } else if (score < 0) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }

      res.send({
        sentiment,
        confidence: result.comparative
      });
    }
  } catch (error) {
    console.error(error);

    res.send({
      sentiment: 'error',
      confidence: 0
    });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
