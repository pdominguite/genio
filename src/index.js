const express = require('express');

const app = express();

app.use(express.json());

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

app.listen(3333, () => {
  console.log("Server started!");
});