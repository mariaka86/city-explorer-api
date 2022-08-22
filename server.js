'use strict';
console.log ('server is connected to js');
//killall -9 node
// REQUIRE
const express=require('express');
const cors = require('cors');
require ('dotenv').config();
//getting data from data file
// let data = require('./data/weather.json');
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
// Film route
app.get('/movies', getFilms);

async function getFilms(request, response){
  try {
    let searchQuery = request.query.searchQuery;
    let url =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
    let cityFilm = await axios.get(url);
    //now dont forget to dig into the movie data with the cityMovie.data.results.map()
    let filmsArray = cityFilm.data.results.map(filmData => new Film(filmData));
    console.log('filmsArray',filmsArray);

    response.status(200).send(filmsArray); //switch over to this when we are ready to send to front end.
     // response.send('hi'); //place holder while building out the function and testing in browser on port 3001.
  } catch (error) {
    console.log(error);
  }
}


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
    let theForecast = weatherData.data.data.map (weatherData => new Forecast(weatherData))
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

class Film{
  constructor(filmObject) {  
    console.log('filmObject',filmObject)
    this.title = filmObject.title;
    this.overview = filmObject.overview;
    this.release_date = filmObject.release_date
    this.src = filmObject.poster_path ? filmObject.poster_path : 'myImage.jpg' ;
    console.log('title',filmObject.title)
  }
}


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
