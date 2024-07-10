const express = require("express");
const app = express();
const dotenv = require("dotenv");
const router = require("./routes");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");


dotenv.config();
app.use(cors());

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
