var cityInfo = document.querySelector(".cityInfo")
var icon = document.querySelector(".icon")
var temp = document.querySelector(".temp")
var wind = document.querySelector(".wind")
var hum = document.querySelector(".hum")
var searchBtn = document.querySelector(".submitBtn")
var searchBar = document.querySelector(".searchBar")
var forecastCard = document.querySelectorAll(".forecastCard")
var apiKey = "6b5170895ce23f4cc7318517a14c4f41"
//var history = JSON.parse(localStorage.getItem("cities")) || []

searchBtn.addEventListener("click", function() {
    var cityName = searchBar.value
    //history.push(cityName)
    //localStorage.setItem("cities", cityName)
    getCurrentData(cityName)
    getForecastData(cityName)
})

function getCurrentData(cityName) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial")
    .then(function(res) {
        return res.json()
    })
    .then(function(data) {
        console.log(data)
        var date = new Date()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var year = date.getFullYear()
        cityInfo.innerHTML = data.name + " - " + month + "/" + day + "/" + year
        icon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
        icon.setAttribute("alt", data.weather[0].description)
        temp.innerHTML = data.main.temp
        wind.innerHTML = data.wind.speed
        hum.innerHTML = data.main.humidity
    })
}

function getForecastData(cityName) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial")
    .then(function(res) {
        return res.json()
    })
    .then(function(data) {
        console.log(data)
        for(var i = 0; i < forecastCard.length; i++) {
            var index = i * 8 + 4
            var date = new Date(data.list[index].dt * 1000)
            var month = date.getMonth() + 1
            var day = date.getDate()
            var year = date.getFullYear()
            var h4 = document.createElement("h4")
            h4.innerHTML = month + "/" + day + "/" + year
            forecastCard[i].append(h4)
            var icon = document.createElement("img")
            icon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[index].weather[0].icon + "@2x.png")
            icon.setAttribute("alt", data.list[index].weather[0].description)
            forecastCard[i].append(icon)
            var temp = document.createElement("p")
            temp.innerHTML = "Temp: " + data.list[index].main.temp + "&#176F"
            forecastCard[i].append(temp)
            var wind = document.createElement("p")
            wind.innerHTML = "Wind: " + data.list[index].wind.speed + "MPH"
            forecastCard[i].append(wind)
            var hum = document.createElement("p")
            hum.innerHTML = "Humidity: " + data.list[index].main.humidity + "%"
            forecastCard[i].append(hum)


        }
        
    })
}