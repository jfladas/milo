import * as fs from 'fs';
import express from 'express';
import e from 'express';
import cookieParser from 'cookie-parser';
import { v4 as uuid } from 'uuid';
import cors from 'cors';

const app = express()
const port = 3000;

app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.options('/start', cors());
app.options('/end', cors());

app.post('/start', (req, res) => {
  // Website you wish to allow to connect
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.cookies.userId) {
    fs.readFile('results.json', 'utf8', (err, fileData) => {
      if (err) {
        console.log('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading file' });
      }

      let results = [];
      try {
        results = JSON.parse(fileData);
      } catch (parseError) {
        console.log('Error parsing JSON:', parseError);
        return res.status(500).json({ error: 'Error parsing JSON' });
      }
      const existingEntry = results.find(entry => entry.player.id === req.cookies.userId);
      if (existingEntry) {
        console.log('Returning user with existing data');
        res.json({
          status: 'returning',
          player: existingEntry.player,
          secrets: existingEntry.secrets
        });
      } else {
        console.log('Returning user without existing data');
        res.clearCookie('userId');
        res.json({
          status: 'new'
        });
      }
    });
  } else {
    console.log('New user');
    res.json({
      status: 'new'
    });
  }
});

app.post('/end', (req, res) => {
  // Website you wish to allow to connect
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const { player, secrets } = req.body;
  let data = { player, secrets };

  console.log('Creating cookie...');
  // Set a cookie named "userId" with a unique identifier
  const uniqueId = uuid();
  res.cookie('userId', uniqueId, { maxAge: 86400000, httpOnly: true });
  data.player.id = uniqueId;

  fs.readFile('results.json', 'utf8', (err, fileData) => {
    if (err) {
      console.log('Error reading file:', err);
      return res.status(500).json({ error: 'Error reading file' });
    }

    let results = [];
    try {
      results = JSON.parse(fileData);
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError);
      return res.status(500).json({ error: 'Error parsing JSON' });
    }

    results.push(data);

    fs.writeFile('results.json', JSON.stringify(results, null, 2), (err) => {
      if (err) {
      console.log('Error writing file:', err);
      return res.status(500).json({ error: 'Error writing file' });
      }

      console.log('Data written to results.json:', data);
      res.json({ success: true });
    });
  });
});

app.listen(port, () => {
  console.log('Server is running on port ' + port + '...');
});