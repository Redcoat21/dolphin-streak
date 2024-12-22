import * as dotenv from "dotenv";
dotenv.config();
const backendUrls = Object.keys(process.env)
  .filter((key) => key.startsWith("BACKEND_URL_"))
  .map((key) => process.env[key])
  .filter((url) => url); // Remove any falsy values (e.g., undefined or empty strings)

export default backendUrls;
