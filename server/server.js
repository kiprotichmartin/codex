// type property in package.json allows us to use import statements
// instead of require statements
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

// to be able to use the env variables
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

// instance of openapi
const openai = new OpenAIApi(configuration);

// initialize express application
const app = express();

// allow server to be called from frontend
app.use(cors());

// allow to pass json from frontend to backend
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // high temperatures -> ai will take more risks in answering
      max_tokens: 3000, //max tokens to generate in a completion -> long responses
      top_p: 1,
      frequency_penalty: 0.5, // not going to repeat similar responses often
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

// make sure server always listens to requests
app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});
