const express = require('express');

const app = express();

const port = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send("OK");
});

app.get('/genio/index', (req, res) => {
  console.log(req.body);
  console.log(req.headers);
  return res.status(200).json({
    "message":"OK"
  });
})

app.post('/genio', (req, res) => {
  console.log(req.body);
  console.log(req.headers);
  return res.status(204).json();
})

app.listen(port, () => {
  console.log("Server started!");
});