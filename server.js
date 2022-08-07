'use strict';
console.log ('server is connected to js');
//killall -9 node
// REQUIRE
const express=require('express');
const cors = require('cors');
require ('dotenv').config();
//getting data from data file
let data = require('./data/weather.json');
const axios= require('axios');
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


// async function getMovies(request, response){
//   try {
//     let searchQuery = request.query.searchQuery; //front end should hit the /movies?searchQuery="value"
//     console.log('A. front end query: ', searchQuery);
//     //https://developers.themoviedb.org/3/search/search-movies
//     let url =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
//     //Test URL localhost:3001/movies?searchQuery=Seattle
//     let cityMovie = await axios.get(url);
//     console.log('B. axios get: ', cityMovie);
//     //response.status(200).send(cityMovie.data); run this to look at the json returned in the browser at port 3001
   
//     //now dont forget to dig into the movie data with the cityMovie.data.results.map()
//     let moviesArray = cityMovie.data.results.map(movieData => new Movie(movieData));
//     console.log('C. Movies ARRAY!!',moviesArray);

//     response.status(200).send(moviesArray); //switch over to this when we are ready to send to front end.
//      // response.send('hi'); //place holder while building out the function and testing in browser on port 3001.
//   } catch (error) {
//     console.log(error);
//   }
// }



// add weather route
app.get('/weather', async(request,response,next) => {
  console.log('request', request.query);
  try{
    let searchQuery= request.query.searchQuery;
    // // user has to enter the city we have data for
    // console.log('searchQuery',searchQuery);
    let lat = request.query.lat;

    let lon= request.query.lon;
  
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?city=Seattle&key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;
    let weatherData = await axios.get(url);
    let theForecast = weatherData .data.data.map (weatherData => new Forecast(weatherData))
    // let cityData = data.find(city => city.city_name=== searchQuery);

    // let lonLoc = data.find(lonLoc=>lonLoc.lon=== lon);

    // let latLoc = data.find(latLoc=>latLoc.lat ===lat);
    // let tempLoc = data.find(tempLoc=>tempLoc.temp === temp);
    // let dataToInstatiate=(new Forecast(cityData,lonLoc,latLoc, tempLoc));
    // let dataToSend=(dataToInstatiate);

    response.status(200).send(theForecast);
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
    this.date= forecastObject.valid_date;
    this.description= forecastObject.weather.description;
    this.temp = forecastObject.temp;
    this.min_temp = forecastObject.min_temp;
    this.max_temp =forecastObject.max_temp;
    this.icon = forecastObject.weather.icon;
    console.log('description',forecastObject.weather.description);
  }

}

app.listen(PORT,()=>console.log (`server is running on ${PORT}`));
