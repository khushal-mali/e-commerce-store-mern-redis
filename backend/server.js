import { express } from "express";

const PORT = process.env.PORT;

const app = express();

app.listen(3000, () => {
  console.log(`App running on server port::${PORT}...`);
});
