let userInput = document.getElementById('user-input');
let cityInput = document.getElementById('write-in');
let cityHeader = document.getElementById('city-name');
let mainTemp = document.getElementById('temp-main');
let mainWind = document.getElementById('wind-main');
let mainHumidity = document.getElementById('humidity-main');
let mainUV = document.getElementById('uv-main');


function Main(event) {
    event.preventDefault();
    let cityName = cityInput.value;
    getLatLon(cityName);
}


function getWeather (cityName,lat,lon) {
   fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=e65fe780f45a130b2c4b730b4f4601f3`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        let unixDate = new Date(data.current.dt*1000);
        let day = unixDate.getDate();
        let month = unixDate.getMonth();
        let year = unixDate.getFullYear();
        cityHeader.innerHTML = `${cityName} ${month}/${day}/${year}`;

        mainTemp.innerHTML = `Temp: ${data.current.temp}*F`;
        mainWind.innerHTML = `Wind: ${data.current.wind_speed} MPH`;
        mainHumidity.innerHTML = `Humidity: ${data.current.humidity}%`;
        mainUV.innerHTML = `UV Index: ${data.current.uvi}`;

        // 5 Day Forecast /////////////////////////////////////////////
        let cardID = ['day1','day2','day3','day4','day5'];
        
        console.log(typeof(day));

        for(let j =0;j<8;j++) {
            let loopDate = new Date(data.daily[j].dt*1000).getDate();
            if(loopDate == day) {
                startDate = j + 1;
            }
        }

        for(let i=0;i<cardID.length;i++) {
            let activeDate = document.getElementById(cardID[i])

            unixDate = new Date(data.daily[startDate].dt*1000);
            day = unixDate.getDate();
            month = unixDate.getMonth();
            year = unixDate.getFullYear();
            activeDate.children[0].innerHTML = `${month}/${day}/${year}`;
            activeDate.children[1].innerHTML = `Temp: ${data.daily[startDate].temp.day}*F`;
            activeDate.children[2].innerHTML = `Wind: ${data.daily[startDate].wind_speed} MPH`;
            activeDate.children[3].innerHTML = `Humidity: ${data.daily[startDate].humidity}%`;
            startDate = startDate + 1
        }

    });
}

function getLatLon(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=e65fe780f45a130b2c4b730b4f4601f3`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        let lat = data[0].lat;
        let lon = data[0].lon;
        getWeather(city,lat,lon);
    });
}

userInput.addEventListener('submit',Main);