// console.log("jai shree ram")

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
const key = "156ae8a16859d4cd6898848eaffbdcbd";
const app = express();

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    let city = req.body.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
                if(weatherData.cod != 200) {
                    return res.sendFile(__dirname + "/error.html")
                }

            res.render("info", {
                cityName: city.slice(0, 1).toUpperCase() + city.slice(1, city.length).toLowerCase(),
                temp: Math.round(weatherData.main.temp - 273.15),
                weatherDescription: weatherData.weather[0].description,
                weatherIcon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                i2: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                feelsLike: Math.round(weatherData.main.feels_like - 273.15),
                pressure: weatherData.main.pressure,
                humidity: weatherData.main.humidity
            })
        })
    })
})

process.on("unhandledRejection", (e) => {
    console.log(e.stack)
})

app.listen(proccess.env.PORT || 5000, () => {
    console.log("app is deployed!")
})