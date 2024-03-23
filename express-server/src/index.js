const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(routes);


app.get('/', (req, res) => {
  res.json({ status: 'API is running on /api' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
