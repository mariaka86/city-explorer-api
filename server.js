'use strict';
console.log ('server is connected to js');
//killall -9 node
// REQUIRE
const express = require('express');
const cors = require('cors');
require ('dotenv').config();
//getting data from data file
// let data = require('./data/weather.json');
const axios = require('axios');

const YELP_API_KEY = process.env.YELP_API_KEY


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
app.get('/movies',async(request,response,next)=>{
  try {
    let searchQuery = request.query.searchQuery;
    let url =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
    let cityFilm = await axios.get(url);
    //now dont forget to dig into the movie data with the cityMovie.data.results.map()
    let filmsArray = cityFilm.data.results.map(filmData => new Film(filmData));
    // console.log('filmsArray',filmsArray);

    response.status(200).send(filmsArray); //switch over to this when we are ready to send to front end.
     // response.send('hi'); //place holder while building out the function and testing in browser on port 3001.
  } catch (error) {
    console.log(error);
  }
})

// add food  route
app.get('/food', async(request,response,next)=>{
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${YELP_API_KEY}`
  
    }
    
  };
  try{

    let url =`https://api.yelp.com/v3/businesses/search?latitude=37.786882&longitude=-122.399972&sort_by=distance&limit=10&format=json`
    let yelpData = await axios.get(url,options)
    console.log('!!!!!!!!!!!!!!!!!!1',options)

    let theRestaurant = yelpData.data.businesses.map(yelpData => new Restaurant(yelpData));
    
    console.log ('!!!!!!!!!!!!!!!!!!!!!!!!!!!restaurantarray', theRestaurant)
    
    response.status(200).send(theRestaurant);

  }catch(error){
    console.log(error)
  }
})


// add weather route
app.get('/weather', async(request,response,next) => {
  // console.log('request', request.query);
  try{
    // let searchQuery= request.query.searchQuery;
    // // user has to enter the city we have data for
    // console.log('searchQuery',searchQuery);
    const{lat,lon}  = request.query;
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
    // console.log('filmObject',filmObject)
    this.title = filmObject.title;
    this.overview = filmObject.overview;
    this.release_date = filmObject.release_date
    this.image_url = `https://image.tmdb.org/t/p/w500${filmObject.poster_path}` ;
    // console.log('title',filmObject.title)
  }
}

class Restaurant{
  constructor(restaurauntObject){
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!restaurauntObject',restaurauntObject)
    this.image_url=restaurauntObject.image_url;
    this.name = restaurauntObject.name;
    this.address = restaurauntObject.location.display_address.join('. ')
    this.hours = !restaurauntObject.is_closed ? 'Open': 'Closed';
    this.rating = restaurauntObject.rating;
    this.price = restaurauntObject.price|| 'Not Available';

  }
}

class Forecast{
  constructor (forecastObject){
    // console.log('forecastObject',forecastObject);
    this.date= forecastObject.valid_date;
    this.description= forecastObject.weather.description;
    this.temp = forecastObject.temp;
    this.min_temp = forecastObject.min_temp;
    this.max_temp =forecastObject.max_temp;
    this.icon = `https://www.weatherbit.io/static/img/icons/${forecastObject.weather.icon}.png`;
    // console.log('description',forecastObject.weather.description);
  }

}

app.listen(PORT,()=>console.log (`server is running on ${PORT}`));
