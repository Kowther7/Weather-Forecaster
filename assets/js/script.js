var cityInfo = document.querySelector(".cityInfo")
var icon = document.querySelector(".icon")
var temp = document.querySelector(".temp")
var wind = document.querySelector(".wind")
var hum = document.querySelector(".hum")
var searchBtn = document.querySelector(".submitBtn")
var searchBar = document.querySelector(".searchBar")
var apiKey = "6b5170895ce23f4cc7318517a14c4f41"
//var history = JSON.parse(localStorage.getItem("cities")) || []

searchBtn.addEventListener("click", function() {
    var cityName = searchBar.value
    //history.push(cityName)
    //localStorage.setItem("cities", cityName)
    getCurrentData(cityName)
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