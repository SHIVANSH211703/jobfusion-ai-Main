const axios = require("axios");

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api";

const searchJobsFromAdzuna = async ({
  page = 1,
  what = "",
  where = "",
  resultsPerPage = 20,
}) => {
  const response = await axios.get(
    `${ADZUNA_BASE_URL}/jobs/in/search/${page}`,
    {
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