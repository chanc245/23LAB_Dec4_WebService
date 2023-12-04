import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';
import { getSign, getZodiac } from 'horoscope';
import OpenAI from 'openai';
// https://www.npmjs.com/package/openai

var cors = require('cors');
app.use(cors());

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001
const __filename = fileURLToPath(import.meta.url); //go to this url and serve that
const __dirname = dirname(__filename);

app.use(bodyParser.json());

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {

  // console.log(req.body)
  let firstName = req.body.firstName
  let lastName = req.body.lastName;
  let dob = req.body.dob;

  let userDOB = dob.split('-')

  let userZodiac = getZodiac(Number(userDOB[0]))
  let userHoroscope = getSign({ month: Number(userDOB[1]), day: Number(userDOB[2]) })

  let gptResponse = 'failed to generate output.. Please try again..'


  console.log("--GPT info sending...")
  async function getGptResultAsString(userZodiac, userHoroscope, firstName, lastName) {
    try {
      const result = await gpt(userZodiac, userHoroscope, firstName, lastName);
      return JSON.stringify(result);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  getGptResultAsString(userZodiac, userHoroscope, firstName, lastName).then(response => {
    gptResponse = response
    console.log(`--GPT promise processed`)
  });

  setTimeout(async () => {
    console.log(`--RIGHT BEFORE respnose json`)
    const response = {
      message: `Welcome ${firstName} ${lastName}! Your date of birth is ${dob}.`,
      horoscope: `Given your date of birth, your horoscope is ${userHoroscope} while your Zodic sign is ${userZodiac}`,
      sign: userHoroscope,
      gpt: `${gptResponse}`
    }
    res.json(response)
  }, 5000);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //

const openai = new OpenAI({
  apiKey: process.env.GPTAPIKEY, //my api key
});

async function gpt(userZodiac, userHoroscope, firstName, lastName) {
  console.log("--GPT info received...")
  // Non-streaming:
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `please guess a persons personally based on their Zodiac sign: ${userZodiac}, their sign: ${userHoroscope}, and name: ${firstName} ${lastName} within 50 words.`
        // content: `please say this is a test`
      }
    ],
    model: 'gpt-3.5-turbo-1106',
    // response_format: { type: "json_object" },
  });
  console.log("--GPT Result:")
  // console.log(completion.choices[0]?.message?.content);
  let gptResult = completion.choices[0]?.message?.content
  console.log(gptResult)
  return gptResult
}