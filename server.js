'use strict';
console.log ('server is connected to js');
//killall -9 node
// REQUIRE
const express=require('express');
const cors = require('cors');
require ('dotenv').config();
//getting data from data file
let data = require('./data/weather.json');
// const{response} = require ('express');
// Use
const app = express();
app.use (cors());
// if port wont work in 3001(in env file) go to 3002
const PORT = process.env.PORT || 3002;
/// verifying server
app.get ('/',(request,response)=>{

  response.send ('server is working?');

});



// add weather route
app.get('/weather', (request,response,next)=>{
  console.log('request', request.query);
  try{
    let searchQuery= request.query.searchQuery;
    // // user has to enter the city we have data for
    console.log('searchQuery',searchQuery);
    let lat = request.query.lat;
    console.log('lat',request.query.lat);
    let lon= request.query.lon;
    let temp = request.query.temp;
    let cityData = data.find(city => city.city_name=== searchQuery);
    console.log ('citydata',cityData);
    let lonLoc = data.find(lonLoc=>lonLoc.lon=== lon);
    console.log('lonLoc',lon);
    let latLoc = data.find(latLoc=>latLoc.lat ===lat);
    let tempLoc = data.find(tempLoc=>tempLoc.temp === temp);
    let dataToSend=(new Forecast(cityData,lonLoc,latLoc, tempLoc));
    console.log ('datatosend work',dataToSend);
    response.status(200).send(cityData,lonLoc,latLoc, tempLoc,dataToSend);

    // if user doesn't select the predetermined city throw an error

  } catch(error){
    response.status(500).send ('invalid location');

    next(error);
  }
});
app.get ('*',(request,response)=>{
  response.send ('Error that route was not found' );
});


class Forecast{
  constructor (forecastObject){
    console.log('forecastObject',forecastObject);
    this.datetime = forecastObject.date;
    this.description= forecastObject.description;
  }

}

app.listen(PORT,()=>console.log (`server is running on ${PORT}`));
