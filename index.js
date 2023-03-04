import { GetVehicleInformation } from './scrape.js';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import bodyParser from 'body-parser';
import express from 'express';

import { validateRegNr } from './utils/vehicle.js';
dotenv.config();

const app = express();
const port = 3010;
app.use(bodyParser.json());

// start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/registrationNumber', (req, res) => {
  const vehicleRegistrationNumber = req.body.registrationNumber;

  if (!validateRegNr(vehicleRegistrationNumber)) {
    return 'not a valid registration number';
  }

  fetchVehicleInfo(vehicleRegistrationNumber);

  console.log(`Received registration number: ${vehicleRegistrationNumber}`);

  res.send(`Received registration number: ${vehicleRegistrationNumber}`);
});

const fetchVehicleInfo = async (vehicleRegistrationNumber) => {
  console.log('fetching vehicle info');
  try {
    const res = await GetVehicleInformation(vehicleRegistrationNumber);
    console.log(res);
    let data = JSON.stringify(res);

    const response = await axios.post(process.env.INTERNALL_API_POST_CALL, res);
    console.log(response.data);
    fs.writeFileSync('seedData.json', data);
  } catch (error) {
    console.warn(error);
    fs.writeFile(
      'error.txt',
      {
        make: res?.vehicleIdentity?.make,
        tradeName: res?.vehicleIdentity?.make,
      },
      (err) => {
        if (err) throw err;
        console.log('Error message written to file');
      },
    );
  }
};
