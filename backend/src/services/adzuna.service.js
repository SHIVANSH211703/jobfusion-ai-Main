const axios = require("axios");

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api";

const searchJobsFromAdzuna = async ({
  page = 1,
  what = "",
  where = "",
  resultsPerPage = 20,
}) => {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    const error = new Error("Job search provider is not configured.");
    error.statusCode = 503;
    throw error;
  }

  const response = await axios.get(
    `${ADZUNA_BASE_URL}/jobs/in/search/${page}`,
    {
      timeout: 15000,
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        results_per_page: resultsPerPage,
        what,
        where,
        "content-type": "application/json",
      },
    }
  );

  return response.data;
};

module.exports = {
  searchJobsFromAdzuna,
};