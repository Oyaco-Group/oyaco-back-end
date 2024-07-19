const express = require("express");
const app = express();
const dotenv = require("dotenv");
const router = require("./routes");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const multerErrorHandler = require("./middleware/multerError");


dotenv.config();
app.use(cors({
  origin : 'http://localhost:3000',
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  optionsSuccessStatus: 200
}));

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(multerErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
