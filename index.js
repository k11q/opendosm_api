const express = require('express');
const axios = require('axios');
const Papa = require('papaparse');

const app = express();
const port = process.env.PORT || 3000;

function filterColumns(data, columns) {
  return data.map((row) => {
    const newRow = {};
    columns.forEach((column) => {
      if (row.hasOwnProperty(column)) {
        newRow[column] = row[column];
      }
    });
    return newRow;
  });
}

app.get('/api/:basename/:filename', async (req, res) => {
  try {
    const { basename, filename } = req.params;
    const { columns } = req.query;

    const response = await axios.get(`https://storage.googleapis.com/${basename}/${filename}.csv`);

    Papa.parse(response.data, {
      header: true,
      complete: (results) => {
        let filteredResults = results.data;

        if (columns) {
          const columnList = columns.split(',');
          filteredResults = filterColumns(filteredResults, columnList);
        }

        res.json(filteredResults);
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

