
var APIkey = "6b5170895ce23f4cc7318517a14c4f41"
const userInput = document.getElementById("user-input");
const searchBtn = document.querySelector("#search-button");
const clearBtn = document.querySelector("#clear-button");
const pastSearch = document.getElementById("past-cities");

const cityName = document.getElementById("city-name");
const date = document.getElementById("date");
const cityTemp = document.getElementById("current-temp");
const cityWind = document.getElementById("current-wind");
const cityHumidity = document.getElementById("current-humidity");

const predictions = document.querySelector("#future-temps");

// Get City From User
function handleSearchFormSubmit(event) {
  event.preventDefault();

  const currentCity = userInput.value;

  if (!currentCity) {
    return;
  }

  const userInputData = localStorage.getItem("userInputData");

  if (userInputData) {
    const cities = JSON.parse(userInputData);
    const existingCity = cities.find((city) => city.name === currentCity);
    // Move to pastSearches()
    if (!existingCity) {
      cities.push({ name: currentCity });
      localStorage.setItem("userInputData", JSON.stringify(cities));
    }
  } else {
    localStorage.setItem(
      "userInputData",
      JSON.stringify([{ name: currentCity }])
    );
  }
  userInput.value = "";
  predictions.innerHTML = "";

  pastSearches();
  getCity(currentCity);
}
searchBtn.addEventListener("click", handleSearchFormSubmit);

// Display Search History
function pastSearches() {
  const pastCities = localStorage.getItem("userInputData");
  pastSearch.innerHTML = "";

  if (pastCities) {
    const cities = JSON.parse(pastCities);

    if (Array.isArray(cities)) {
      cities.reverse();

      cities.forEach((userInputData, index) => {
        const cityBtns = document.createElement("button");

        cityBtns.textContent = userInputData.name;
        cityBtns.addEventListener("click", () => handleBtnClick(index));
        pastSearch.appendChild(cityBtns);
      });
    }
  }
}

// History Buttons
function handleBtnClick(index) {
  const cityRetrieval = localStorage.getItem("userInputData");

  if (cityRetrieval) {
    const cities = JSON.parse(cityRetrieval);
    const reversedCities = cities.slice().reverse();

    const currentCity = reversedCities[index].name;

    getCity(currentCity);
  }
}

// Clear History
function handleHistoryClearSubmit(event) {
  event.preventDefault();

  localStorage.removeItem("userInputData");
  pastSearches();
}
clearBtn.addEventListener("click", handleHistoryClearSubmit);

// Set The Width Of Model
function setModalWidth(width) {
  const modalContent = document.querySelector(".modal-content");
  modalContent.style.width = width + "px";
}

// Show Modal With Error Message
function showErrorModal(errorMessage) {
  const modal = document.getElementById("errorModal");
  const errorText = document.getElementById("errorText");

  errorText.textContent = errorMessage;
  modal.style.display = "flex"; // Appears Only When There's A Error

  const errorMessageLength = errorMessage.length;
  const maxWidth = 500;
  const calcWidth = Math.min(maxWidth, errorMessageLength * 12);

  setModalWidth(calcWidth);
}

// Close The Modal
function closeModal() {
  const modal = document.getElementById("errorModal");
  modal.style.display = "none";
}

// Retrieve Weather Forecast Data From API
function getCity(currentCity) {
  const userCityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${APIkey}&units=imperial`;

  fetch(userCityUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found. Please try again.");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      showCurrentWeather(data);
      showPrediction(data);
    })
    .catch((error) => {
      console.error(error);
      showErrorModal(error.message);
    });
  return;
}

// Show Date As MMM D, YYYY
function formatDateLetters(lettersString) {
  const options = { year: "numeric", month: "short", day: "numeric" };

  return new Date(lettersString).toLocaleDateString(undefined, options);
}

// Show the Current Weather Icon
function showSkyIcon(data) {
  const iconCode = data.list[0].weather[0].icon;
  const skyIconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
  const currentSkyIconEl = document.createElement("img");
  const existingSkyIcon = document.getElementById("weather-icon-img");

  currentSkyIconEl.setAttribute("id", "weather-icon-img");
  currentSkyIconEl.setAttribute("src", skyIconUrl);

  if (existingSkyIcon) {
    existingSkyIcon.remove();
  }

  document.getElementById("weather-icon").appendChild(currentSkyIconEl);
  closeModal();
}

// Show Current Data From API
function showCurrentWeather(data) {
  cityName.textContent = data.city.name;
  (date.textContent = formatDateLetters(data.list[0].dt_txt.substring(0, 10))),
    showSkyIcon(data);
  cityTemp.textContent = data.list[0].main.temp;
  cityWind.textContent = data.list[0].wind.speed;
  cityHumidity.textContent = data.list[0].main.humidity;
}

// Show Date As MM/DD/YY
function formatDateNum(numString) {
  const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
  return new Date(numString).toLocaleDateString(undefined, options);
}

// Show the Future Weather Icon
function displaySkyImg(data, i) {
  const iconCode = data.list[i].weather[0].icon;
  const skyImgUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
  const futureSkyImgEl = document.createElement("img");

  futureSkyImgEl.setAttribute("src", skyImgUrl);
  return futureSkyImgEl;
}

// Show Data For The Next 5 Days
function showPrediction(data) {
  predictions.innerHTML = "";

  for (let i = 0; i <= data.list.length - 1; i = i + 8) {
    const section = document.createElement("section");
    section.id = "FiveDays";
    section.className = "card col-3 m-1 d-inline-block bg-info";

    const dateHeading = document.createElement("h4");
    dateHeading.className = "date p-2";
    dateHeading.textContent = formatDateNum(
      data.list[i].dt_txt.substring(0, 10)
    );
    section.appendChild(dateHeading);

    const weatherIconContainer = document.createElement("div");
    weatherIconContainer.className = "weather-icon-container";
    weatherIconContainer.appendChild(displaySkyImg(data, i));
    section.appendChild(weatherIconContainer);

    const tempParagraph = document.createElement("p");
    tempParagraph.className = "text-top";
    tempParagraph.textContent = `Temp: ${data.list[i].main.temp} °F`;
    section.appendChild(tempParagraph);

    const windParagraph = document.createElement("p");
    windParagraph.className = "text-top";
    windParagraph.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
    section.appendChild(windParagraph);

    const humidityParagraph = document.createElement("p");
    humidityParagraph.className = "text-top";
    humidityParagraph.textContent = `Humidity: ${data.list[i].main.humidity} %`;
    section.appendChild(humidityParagraph);

    predictions.appendChild(section);
  }
}

// Call pastSearches initially to display search history if available
pastSearches();