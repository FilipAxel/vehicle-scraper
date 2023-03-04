/* const api2 = require("fordonsuppgifter-api-wrapper"); */
const fs = require('fs');
const { GetVehicleInformation } = require('./scrape');
const axios = require('axios');
require('dotenv').config();

const directoryName = 'car-data';

(async () => {
  console.log('fetching vehicle info');
  var res = await GetVehicleInformation('LOE61U').catch((e) => {
    console.warn(e);
    console.warn('fetching failed');
  });
  let data = JSON.stringify(res);

  axios
    .post(process.env.INTERNALL_API_POST_CALL, res)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.warn(error);
    });

  const tradeName = res.vehicleIdentity.tradeName.replace(/\s+/g, '-');

  fs.mkdir(directoryName, (err) => {
    if (err && err.code !== 'EEXIST') {
      console.error('Error creating directory:', err);
      return;
    }
    fs.writeFileSync(`${tradeName}.json`, data);
    fs.writeFile(`${directoryName}/${tradeName}.json`, data, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }

      console.log('File successfully written to directory:', directoryName);
    });
  });
})();
