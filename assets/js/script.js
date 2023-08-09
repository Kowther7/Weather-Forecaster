var cityInfo = document.querySelector(".cityInfo")
var temp = document.querySelector(".temp")
var wind = document.querySelector(".wind")
var hum = document.querySelector(".hum")
var searchBtn = document.querySelector(".submitBtn")
var searchBar = document.querySelector(".searchBar")
var apiKey = "6b5170895ce23f4cc7318517a14c4f41"

searchBtn.addEventListener("click", function() {
    var cityName = searchBar.value
    getCurrentData(cityName)
})

function getCurrentData(cityName) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial")
    .then(function(res) {
        return res.json()
    })
    .then(function(data) {
        console.log(data)
    })
}