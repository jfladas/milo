import * as fs from 'fs';
import express from 'express';
//import bodyParser from 'body-parser';

const app = express()
const port = 3000;

app.use(express.json());

//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Lese File
  fs.readFile('data.json', 'utf8', (err, data) => {
    let data = [];
    let newString = '';
    let newNumber = 0;
    let newObj = {};

    if (err) {
      console.log('Error: ' + err);
      res.write('Error: ' + err);
      return;
    } else {
      data = JSON.parse(data);
      newString = req.query.string;
      newNumber = Number(req.query.number);
      // Neuer Score in Array einfügen
      newObj = {'string': newString, 'number': newNumber};
      data.push(newObj);
      res.json(data);
 
      
      
      fs.writeFile('data.json', JSON.stringify(data) , (err) => {
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
/*
app.get('/player', (req, res) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Lese File
  fs.readFile('results.json', 'utf8', (err, data) => {
    let results = [];
    let newName = '';
    let newObj = {};

    if (err) {
      console.log('Error: ' + err);
      res.write('Error: ' + err);
      return;
    } else {
      results = JSON.parse(data);
      newName = req.query.name;
      newObj = { 'name': newName };
      results.push(newObj);
      res.json(results);



      fs.writeFile('results.json', JSON.stringify(results), (err) => {
        if (err) {
          console.log('Error: ' + err);
          res.write('Error: ' + err);
        } else {
          console.log('Wrote new Results: ' + JSON.stringify(newObj));
        }
      });
    }
  });
});
*/

app.post('/post', (req, res) => {
  let data = req.body;
  console.log("Data: " + data);
  //res.json({ message: 'Data Received', data });
  res.send('Data Received: ' + JSON.stringify(data));
});

app.listen(port, () => {
  console.log('Server is running on port ' + port + '...');
});