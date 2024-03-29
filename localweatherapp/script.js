"use strict";

const months = {
  1: "Jan",
  2: "Feb",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "Aug",
  9: "Sep ",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const dateFormat = document.querySelector(".date");
const countryData = document.querySelector(".country");
const temperatureData = document.querySelector(".temperature");
const feelsLikeData = document.querySelector(".feel");
const humidityData = document.querySelector(".humidity");
const pressureData = document.querySelector(".pressure");
const visibilityData = document.querySelector(".visibility");
const searchbtn = document.querySelector(".search-button");
const searchfield = document.querySelector(".search-field");
const searchErr = document.querySelector(".search-error");
const datainfo = document.querySelector(".data-info");
const notwork = document.querySelector(".not-working");
const btnnotworking = document.querySelector(".btn-notworking");
const btnimperial = document.querySelector(".btn--imperial");
const btnmetric = document.querySelector(".btn--metric");
const btnunits = document.querySelector(".btn-container");
const darkbutton = document.querySelector(".dark");
const lightbutton = document.querySelector(".light");
const universal = document.querySelector(".universal");
const title = document.querySelector(".title-info");
const navbar = document.querySelector(".navigation-bar");
const searchbar = document.querySelector(".search");
const localweather = document.querySelector(".local-weather");

let globalCountryValue = [];

const displayMap = function (lat, lng) {
  var container = L.DomUtil.get("map");
  if (container != null) {
    container._leaflet_id = null;
  }

  var map = L.map("map").setView([lat, lng], 9);
  L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=s63Ab7NJrGR3Ew6TVD4W",
    {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  ).addTo(map);
};

let html = `<p class="search-error">
               Unable to get data. Please make sure to no commas (just use space) i.e Texas  USA
            </p>`;

const getData = async function (city, country) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},%20${country}&appid=6fc9ac47c4cb1b28f122d2c1edc9df51&units=metric`
    );

    if (response.status === 404) return (searchErr.style.opacity = 1);

    searchErr.style.opacity = 0;

    const dataWeather = await response.json();
    const lat = dataWeather.coord.lat;
    const lng = dataWeather.coord.lon;

    const cname = dataWeather.name;
    const cid = dataWeather.sys.country;
    globalCountryValue.splice(0, 2);
    globalCountryValue.push(cname);
    globalCountryValue.push(cid);
    console.log(globalCountryValue);

    displayData(dataWeather);
    displayMap(lat, lng);
  } catch (error) {
    console.log(error);
  }
};

const getDataImperial = async function (value) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value[0]},%20${value[1]}&appid=6fc9ac47c4cb1b28f122d2c1edc9df51&units=imperial`
  );

  if (response.status === 404) return (searchErr.style.opacity = 1);

  const dataWeather = await response.json();
  dateFormat.textContent = "";

  // Display Country Text
  countryData.textContent = `${dataWeather.name} , ${dataWeather.sys.country}`;
  // Display Temperature
  temperatureData.textContent = `${dataWeather.main.temp.toFixed(0)}°F`;
  // Display Feels
  feelsLikeData.textContent = `Feels like ${dataWeather.main.feels_like.toFixed(
    0
  )}°C , ${dataWeather.weather[0].description}`;
  // Display Weather Details

  // Humidity
  humidityData.textContent = `Humidity: ${dataWeather.main.humidity}%`;
  //  Pressure
  pressureData.textContent = `Pressure: ${dataWeather.main.pressure}Pa`;
  //Visibility
  visibilityData.textContent = `Visibility: ${dataWeather.visibility / 1000}km`;
};

const getDataMetric = async function (value) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value[0]},%20${value[1]}&appid=6fc9ac47c4cb1b28f122d2c1edc9df51&units=metric`
  );

  if (response.status === 404) return (searchErr.style.opacity = 1);

  const dataWeather = await response.json();
  displayData(dataWeather);
};

const displayData = function (data) {
  const date = new Date();
  dateFormat.textContent = "";

  // Display Country Text
  countryData.textContent = `${data.name} , ${data.sys.country}`;
  // Display Temperature
  temperatureData.textContent = `${data.main.temp.toFixed(0)}°C`;
  // Display Feels
  feelsLikeData.textContent = `Feels like ${data.main.feels_like.toFixed(
    0
  )}°C , ${data.weather[0].description}`;
  // Display Weather Details

  // Humidity
  humidityData.textContent = `Humidity: ${data.main.humidity}%`;
  //  Pressure
  pressureData.textContent = `Pressure: ${data.main.pressure}Pa`;
  //Visibility
  visibilityData.textContent = `Visibility: ${data.visibility / 1000}km`;
};

btnimperial.addEventListener("click", function (e) {
  getDataImperial(globalCountryValue);
});

btnmetric.addEventListener("click", function (e) {
  getDataMetric(globalCountryValue);
});

searchbtn.addEventListener("click", function (e) {
  const value = searchfield.value;
  searchfield.value = "";
  if (value === " ") return;
  let countryArr = value.split(" ");
  getData(countryArr[0], countryArr[1]);
});

const getLocalPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getWeatherDataMetric = async function () {
  const position = await getLocalPosition();

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=6fc9ac47c4cb1b28f122d2c1edc9df51&units=metric`
  );

  const dataWeather = await response.json();
  const cname = dataWeather.name;
  const cid = dataWeather.sys.country;
  globalCountryValue.push(cname);
  globalCountryValue.push(cid);
  console.log(globalCountryValue);

  const date = new Date();

  // Display Date
  dateFormat.textContent = `${months[date.getMonth()]} , ${date.getDate()} , ${
    (date.getHours() + 24) % 12 || 12
  }:${date.getUTCMinutes()}`;

  // Display Country Text
  countryData.textContent = `${dataWeather.name} , ${dataWeather.sys.country}`;
  // Display Temperature
  temperatureData.textContent = `${dataWeather.main.temp.toFixed(0)}°C`;
  // Display Feels
  feelsLikeData.textContent = `Feels like ${dataWeather.main.feels_like.toFixed(
    0
  )}°C , ${dataWeather.weather[0].description}`;
  // Display Weather Details

  // Humidity
  humidityData.textContent = `Humidity: ${dataWeather.main.humidity}%`;
  //  Pressure
  pressureData.textContent = `Pressure: ${dataWeather.main.pressure}Pa`;
  //Visibility
  visibilityData.textContent = `Visibility: ${dataWeather.visibility / 1000}km`;

  // dataWeather.
  btnunits.style.opacity = 1;
  notwork.style.opacity = 1;
  datainfo.style.opacity = 1;
  displayMap(lat, lng);
};

getWeatherDataMetric().catch(function (error) {
  // IF ERROR CODE 1 THEN DISPLAY MESSAGE ON  wEBSITE TO TURN ON LOCATION AND RELOAD THE PAGE
  if (error.code === 1) {
    searchErr.textContent = "Please Allow location";
    searchErr.style.opacity = 1;
  }
});

darkbutton.addEventListener("click", function () {
  document.body.style.backgroundColor = "#111111ec";
  title.style.color = "white";
  countryData.style.color = "white";
  temperatureData.style.color = "white";
  navbar.style.backgroundColor = "black";
  searchbar.style.backgroundColor = "black";
  searchfield.style.backgroundColor = "#000";
  btnmetric.style.backgroundColor = "white";
  btnmetric.style.color = "black";
  btnimperial.style.backgroundColor = "white";
  btnimperial.style.color = "black";
  localweather.style.color = "white";
});

lightbutton.addEventListener("click", function () {
  document.body.style.backgroundColor = "white";
  title.style.color = "black";
  countryData.style.color = "black";
  temperatureData.style.color = "black";
  navbar.style.backgroundColor = "#f5f5f5";
  searchbar.style.backgroundColor = "#f5f5f5";
  searchfield.style.backgroundColor = "white";
  btnmetric.style.backgroundColor = "black";
  btnmetric.style.color = "white";
  btnimperial.style.backgroundColor = "black";
  btnimperial.style.color = "white";
  localweather.style.color = "black";
});




