import { GetVehicleInformation } from './scrape.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const VehicleRegistrationNumber = 'XDG423';

const fetchVehicleInfo = async () => {
  console.log('fetching vehicle info');
  try {
    const res = await GetVehicleInformation(VehicleRegistrationNumber);
    let data = JSON.stringify(res);

    const response = await axios.post(process.env.INTERNALL_API_POST_CALL, res);
    console.log(response.data);
  } catch (error) {
    console.warn(error);
    fs.writeFile('error.txt', res.vehicleIdentity.tradeName, (err) => {
      if (err) throw err;
      console.log('Error message written to file');
    });
  }
};

fetchVehicleInfo();
