const apiKey = "684b77547c7b6534f56cf19151367908";
const container = document.querySelector(".container");

document
  .getElementById("weatherForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value;
    const apiCityQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiCityQueryUrl);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      displayNotfound();
    }
  });

document.getElementById("getLocation").addEventListener("click", function () {
  window.navigator.geolocation.getCurrentPosition(async (res) => {
    document.getElementById("cityInput").value = "";
    const apiLocationQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${res.coords.latitude}&lon=${res.coords.longitude}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiLocationQueryUrl);

      if (!response.ok) {
        throw new Error("Location not found");
      }
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      displayNotfound();
    }
  });
});

function displayWeather(data) {
  const input = document.getElementById("cityInput").value;
  const weatherResult = document.getElementById("weatherResult");
  const weatherIcon = document.getElementById("weatherIcon");
  const temperature = document.getElementById("temperature");
  const city = document.getElementById("city");
  const description = document.getElementById("description");
  const humidityData = document.getElementById("humidityData");
  const windData = document.getElementById("windData");
  const icon = `./images/${data.weather[0].icon}.png`;
  const notFoundElem = document.querySelector(".notFound");

  notFoundElem.style.display = "none";
  container.style.height = "750px";

  setTimeout(() => {
    weatherResult.style.display = "flex";
    weatherIcon.src = icon;
    weatherIcon.alt = data.weather[0].description;
    city.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    humidityData.textContent = `${data.main.humidity}%`;
    windData.textContent = `${data.wind.speed} m/s`;
    document.getElementById("cityInput").value = "";
  }, 800);
}

const displayNotfound = () => {
  const weatherResult = document.getElementById("weatherResult");
  const notFoundElem = document.querySelector(".notFound");

  weatherResult.style.display = "none";
  container.style.height = "600px";

  setTimeout(() => {
    notFoundElem.style.display = "flex";
    document.getElementById("cityInput").value = "";
  }, 800);
};
