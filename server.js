const express = require('express');
const cors = require('cors');

const AI_CALL = require('./AI.js');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/create-portfolio', async (req, res) => {
  const { dollarValue, term, risk, tags } = req.body;
  
  // Here you would implement your portfolio creation logic
  // For example, return a mock array of JSON data:
  const portfolio = await AI_CALL(dollarValue, term, risk, tags);

  console.log("portfolio:");
  console.log(portfolio);
  
  res.json(portfolio);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
