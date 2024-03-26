import * as fs from 'fs';
import express from 'express';

const app = express()
const port = 3000;

app.get('/', (req, res) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Lese File
  fs.readFile('results.json', 'utf8', (err, data) => {
    let results = [];
    let newString = '';
    let newNumber = 0;
    let newObj = {};

    if (err) {
      console.log('Error: ' + err);
      res.write('Error: ' + err);
      return;
    } else {
      results = JSON.parse(data);
      newString = req.query.string;
      newNumber = Number(req.query.number);
      // Neuer Score in Array einfügen
      newObj = {'string': newString, 'number': newNumber};
      results.push(newObj);
      res.json(results);
 
      
      
      fs.writeFile('results.json', JSON.stringify(results) , (err) => {
        if (err){
          console.log('Error: ' + err);
          res.write('Error: ' + err);
        } else {
          console.log('Wrote new Results: ' + JSON.stringify(newObj));
        }
      });
      
      //res.end();
    }
  });
});

app.listen(port, () => {
  console.log('Server is running on port ' + port + '...');
});