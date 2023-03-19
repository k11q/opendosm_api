const express = require("express");
const axios = require("axios");
const Papa = require("papaparse");
const cors = require("corse");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

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

function passesFilters(row, filters) {
  for (const column in filters) {
    if (
      row.hasOwnProperty(column) &&
      row[column] !== filters[column]
    ) {
      return false;
    }
  }
  return true;
}

app.get("/api/:bucket/:file_name", async (req, res) => {
  try {
    const { bucket, file_name } = req.params;
    const { columns, limit } = req.query;

    const itemLimit = parseInt(limit);
    
    if (bucket == "catalog" || bucket == "dashboard") {
      axios.get(
        `https://raw.githubusercontent.com/dosm-malaysia/aksara-data/main/${bucket}/${file_name}.json`
      )
        .then(function (response) {
          res.setHeader(
            "Content-Type",
            "application/json"
          );
          res.send(response.data);
        })
        .catch(function (error) {
          res.status(500).json({
            message: `Error fetching JSON file :${bucket}/${file_name}`,
            error,
          });
        });
    } else {
      let filteredResults = [];

      // Filter data using query parameters
      const filters = { ...req.query };
      delete filters.columns; // Remove 'columns' from the filters
      delete filters.limit; // Remove 'limit' from the filters

      let itemCount = 0;

      axios({
        method: 'get',
        url: `https://storage.googleapis.com/${bucket}/${file_name}.csv`,
        responseType: 'stream',
      }).then((response) => {
        const readStream = response.data;
        const parser = readStream.pipe(Papa.parse(Papa.NODE_STREAM_INPUT, { header: true }));

        parser.on('data', (row) => {
          if (passesFilters(row, filters)) {
            filteredResults.push(row);
            itemCount++;
            if (itemCount >= itemLimit && limit) {
              parser.end();
            }
          }
        });

        parser.on('end', () => {
          if (columns) {
            const columnList = columns.split(",");
            filteredResults = filterColumns(filteredResults, columnList);
          }

          res.json(filteredResults);
        });

        parser.on('error', (err) => {
          res.status(500).json({
            message: `Error parsing CSV file :${bucket}/${file_name}`,
            error: err,
          });
        });
      }).catch((error) => {
        res.status(500).json({
          message: `Error fetching CSV file: :${bucket}/${file_name}`,
          error,
        });
      });
    }
  } catch (error) {
		res.status(500).json({
			message: `Error fetching CSV file: :${bucket}/${file_name}`,
			error,
		});
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
