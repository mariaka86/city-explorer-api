'use strict';
console.log ('server is connected to js');

require('dotenv');
const express = require('express');
const cors = require('cors');
// app.use(cors());
const weather = require('./modules/weather.js');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3002;


app.get('/weather', weatherHandler);

async function weatherHandler(request, response,next) {
  try{
  let {lat,lon} = request.query;
  // const lat = weather.find(city =>city.lat === lat);
  // const lon = weather.find(city =>city.lon === lon);
  let summaries= await axios.get(lat,lon)

  // then(summaries => response.send(summaries))


    // const summaries =  response.status(200).send(summaries);
  }catch(error){
    console.log(error);
    response.status(500).send('Sorry. Something went wrong!');
    next(error);
  }
}

app.listen(PORT,() => console.log(`Server up on ${PORT}`));
