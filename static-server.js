const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.static(path.join(__dirname)));
app.listen(PORT, () => console.log(`Frontend static server on http://localhost:${PORT}`));
