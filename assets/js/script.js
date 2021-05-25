let userInput = document.getElementById('user-input');
let cityInput = document.getElementById('write-in');
let cityHeader = document.getElementById('city-name');
let mainTemp = document.getElementById('temp-main');
let mainWind = document.getElementById('wind-main');
let mainHumidity = document.getElementById('humidity-main');
let mainUV = document.getElementById('uv-main');
let searchBox = document.getElementById('search-box');

let savedCities = [];

function Main() {
    let cityName = cityInput.value;
    console.log(cityName);
    getLatLon(cityName);
}

function getWeather (cityName,lat,lon) {
   fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=e65fe780f45a130b2c4b730b4f4601f3`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let unixDate = new Date(data.current.dt*1000);
        let day = unixDate.getDate();
        let month = unixDate.getMonth();
        let year = unixDate.getFullYear();
        cityHeader.innerHTML = `${cityName} ${month}/${day}/${year} <img src='http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png' style='height:36px'/>`;

        mainTemp.innerHTML = `Temp: ${data.current.temp}\u00B0F`;
        mainWind.innerHTML = `Wind: ${data.current.wind_speed} MPH`;
        mainHumidity.innerHTML = `Humidity: ${data.current.humidity}%`;
        mainUV.innerHTML = `UV Index: ${data.current.uvi}`;

        // 5 Day Forecast /////////////////////////////////////////////
        let cardID = ['day1','day2','day3','day4','day5'];

        for(let j =0;j<8;j++) {
            let loopDate = new Date(data.daily[j].dt*1000).getDate();
            if(loopDate == day) {
                startDate = j + 1;
            }
        }

        for(let i=0;i<cardID.length;i++) {
            let activeDate = document.getElementById(cardID[i]);

            unixDate = new Date(data.daily[startDate].dt*1000);
            day = unixDate.getDate();
            month = unixDate.getMonth();
            year = unixDate.getFullYear();
            activeDate.children[0].innerHTML = `${month}/${day}/${year}`;
            activeDate.children[1].innerHTML = `<img src='http://openweathermap.org/img/wn/${data.daily[startDate].weather[0].icon}@2x.png' style='height:36px'/>`;
            activeDate.children[2].innerHTML = `Temp: ${data.daily[startDate].temp.day}\u00B0F`;
            activeDate.children[3].innerHTML = `Wind: ${data.daily[startDate].wind_speed} MPH`;
            activeDate.children[4].innerHTML = `Humidity: ${data.daily[startDate].humidity}%`;
            startDate = startDate + 1;
        }

    });
}

function getLatLon(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=e65fe780f45a130b2c4b730b4f4601f3`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let lat = data[0].lat;
        let lon = data[0].lon;
        getWeather(city,lat,lon);
        let count = 0;
        for(let i=0;i<savedCities.length;i++){
            console.log(savedCities[i][0]);
            if(savedCities[i][0] === city){
                count = 1;
            };
        };
        if(count === 0) {
            let newCity = [city,lat,lon];
            savedCities.push(newCity);
            localStorage.setItem('savedCities',savedCities);
            newButton = document.createElement('button');
            newButton.setAttribute('class','button is-align-items-center is-info is-light m-2');
            newButton.setAttribute('id','city-button');
            newButton.setAttribute('data-city', newCity[0]);
            newButton.innerHTML = city;
            searchBox.appendChild(newButton);
        };
        
    });
}

userInput.addEventListener('submit',function(event) {
    event.preventDefault();
    Main();
});

searchBox.addEventListener('click',function(event) {
    if(event.target.id === 'city-button') {
        cityInput.value = event.target.getAttribute('data-city');
        Main();
    };
});