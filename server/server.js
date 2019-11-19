const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "..", "build")));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

