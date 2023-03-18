const express = require('express');
const axios = require('axios');
const Papa = require('papaparse');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/:basename/:filename', async (req, res) => {
  try {
    const { basename, filename } = req.params;
    const response = await axios.get(`https://storage.googleapis.com/${basename}/${filename}.csv`);

    Papa.parse(response.data, {
      header: true,
      complete: (results) => {
        res.json(results.data);
      },
      error: (err) => {
        res.status(500).json({ message: `Error parsing CSV file :${basename}/${filename}`, error: err });
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching CSV file: :${basename}/${filename}`, error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

