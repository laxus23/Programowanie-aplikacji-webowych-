"use strict";
exports.__esModule = true;
exports.UI = void 0;
require("./style.scss");
var apiCaller_1 = require("./apiCaller");
var date_utils_1 = require("./date-utils");
var LIST_ELEMTNS;
(function (LIST_ELEMTNS) {
    LIST_ELEMTNS["name"] = "name";
    LIST_ELEMTNS["temp"] = "temp";
    LIST_ELEMTNS["pressure"] = "press";
    LIST_ELEMTNS["icon"] = "icon";
})(LIST_ELEMTNS || (LIST_ELEMTNS = {}));
var WEATHER_TYPES;
(function (WEATHER_TYPES) {
    WEATHER_TYPES["thunderstorm"] = "2";
    WEATHER_TYPES["drizzle"] = "3";
    WEATHER_TYPES["rain"] = "5";
    WEATHER_TYPES["snow"] = "6";
    WEATHER_TYPES["atmosphere"] = "7";
    WEATHER_TYPES["clear"] = "8";
})(WEATHER_TYPES || (WEATHER_TYPES = {}));
var UI = /** @class */ (function () {
    function UI(main) {
        this.mainContext = main;
    }
    UI.prototype.showApiError = function () {
        var toastEl = document.getElementById('errorToast');
        // add class that animates the toast
        toastEl.classList.add('visible');
        toastEl.addEventListener("animationend", function handler(e) {
            toastEl.classList.remove('visible');
            // remove `animationend` event after execution for performance reasons
            e.currentTarget.removeEventListener(e.type, handler);
        });
    };
    // main UI
    UI.prototype.renderMainView = function (forecastData, activeCity) {
        if (forecastData) {
            document.getElementById('main').classList.add('main--visible');
            this.switchTheme(activeCity.weather[0].id);
            this.renderForecast(forecastData);
            // general
            document.getElementById('mainCity').innerHTML = activeCity.name;
            document.getElementById('mainWeather').innerHTML = activeCity.weather[0].description;
            document.getElementById('mainTime').innerHTML = date_utils_1.getDay(activeCity.dt, activeCity.timezone);
            // icon
            var iconEl = document.getElementById("mainIcon");
            iconEl.src = "http://openweathermap.org/img/wn/" + activeCity.weather[0].icon + "@2x.png";
            iconEl.alt = activeCity.weather[0].description;
            iconEl.title = activeCity.weather[0].description;
            // temp
            document.getElementById('mainTemp').innerHTML = activeCity.main.temp.toFixed(1) + "\u00B0C";
            document.getElementById('mainTempFeels').innerHTML = activeCity.main.feels_like + "\u00B0C";
            // wind
            document.getElementById('mainWindSpeed').innerHTML = activeCity.wind.speed + "m/s";
            document.getElementById('mainWindIcon').style.transform = "rotate(" + activeCity.wind.deg + "deg)";
        }
    };
    UI.prototype.renderForecast = function (forecastData) {
        var dailyData = forecastData.daily.slice(1);
        var wrapper = document.getElementById('forecast');
        wrapper.innerHTML = null;
        dailyData.forEach(function (data, index) {
            var item = document.createElement('li');
            item.className = "forecast-item";
            // child items
            var itemDate = document.createElement('p');
            itemDate.innerText = index === 0 ? 'tomorrow' : date_utils_1.getDay(data.dt, forecastData.timezone_offset);
            var itemIcon = document.createElement('img');
            itemIcon.innerText = date_utils_1.getDay(data.dt, forecastData.timezone_offset);
            itemIcon.src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
            itemIcon.alt = data.weather[0].description;
            itemIcon.title = data.weather[0].description;
            var itemTemp = document.createElement('p');
            itemTemp.innerText = data.temp.min.toFixed(1) + "\u00B0C / " + data.temp.max.toFixed(1) + "\u00B0C";
            // appending
            item.appendChild(itemDate);
            item.appendChild(itemIcon);
            item.appendChild(itemTemp);
            wrapper.appendChild(item);
        });
    };
    UI.prototype.switchTheme = function (weatherId) {
        var firstNumber = String(weatherId)[0];
        var video = document.getElementById('bgVideo');
        var videoSrc;
        switch (firstNumber) {
            case WEATHER_TYPES.thunderstorm:
                videoSrc = 'https://cdn.videvo.net/videvo_files/video/premium/video0035/small_watermarked/900-1_900-0152-PD2_preview.mp4';
                break;
            case WEATHER_TYPES.drizzle:
                videoSrc = 'https://cdn.videvo.net/videvo_files/video/premium/video0035/small_watermarked/900-1_900-0144-PD2_preview.mp4';
                break;
            case WEATHER_TYPES.rain:
                videoSrc = 'https://cdn.videvo.net/videvo_files/video/free/2020-01/small_watermarked/200116_Lens effect_4k_073_preview.mp4';
                break;
            case WEATHER_TYPES.snow:
                videoSrc = 'https://cdn.videvo.net/videvo_files/video/free/2015-09/small_watermarked/Slow_Snow_Seg_Comp_Flakes_preview.webm';
                break;
            case WEATHER_TYPES.atmosphere:
                videoSrc = 'https://static.videezy.com/system/resources/previews/000/034/069/original/Mountain-rain5.mp4';
                break;
            case WEATHER_TYPES.clear:
                videoSrc = 'https://cdn.videvo.net/videvo_files/video/free/2016-08/small_watermarked/VID_20160517_175443_preview.mp4';
                break;
            default:
                videoSrc = 'https://cdn.videvo.net/videvo_files/video/free/2018-07/small_watermarked/180705_01_03_preview.mp4';
                break;
        }
        if (weatherId > 1)
            videoSrc = 'https://cdn.videvo.net/videvo_files/video/free/2015-07/small_watermarked/Clouds_1_1_preview.webm';
        video.src = videoSrc;
    };
    // aside UI
    UI.prototype.removeCity = function (id) {
        var allCities = JSON.parse(localStorage.getItem(apiCaller_1.DATA_KEY));
        if (allCities && id) {
            var filterdCities = allCities.filter(function (v) { return v.id !== id; });
            localStorage.setItem(apiCaller_1.DATA_KEY, JSON.stringify(filterdCities));
            this.renderWeatherList(filterdCities, true);
        }
    };
    UI.prototype.populateListElement = function (element, weatherData) {
        var parentId = element.id;
        var iconEl = document.querySelector("#" + parentId + " #" + parentId + "_" + LIST_ELEMTNS.icon);
        iconEl.src = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
        iconEl.alt = weatherData.weather[0].description;
        iconEl.title = weatherData.weather[0].description;
        document.querySelector("#" + parentId + " #" + parentId + "_" + LIST_ELEMTNS.name).innerHTML = weatherData.name;
        document.querySelector("#" + parentId + " #" + parentId + "_" + LIST_ELEMTNS.pressure).innerHTML = weatherData.main.pressure + " hPA";
        document.querySelector("#" + parentId + " #" + parentId + "_" + LIST_ELEMTNS.temp).innerHTML = weatherData.main.temp.toFixed(1) + "\u00B0C";
        return element;
    };
    UI.prototype.renderWeatherElement = function (weatherData, elementId) {
        var _this = this;
        var wrapper = document.getElementById('cityList');
        // main element
        var element = document.createElement('li');
        element.id = elementId;
        // other elements
        var elementBtn = document.createElement('button');
        var elementBtnContainer = document.createElement('div');
        var elementBtnContainerChild = document.createElement('div');
        elementBtn.className = "city-list-item";
        // name
        var nameEl = document.createElement('p');
        nameEl.id = elementId + "_" + LIST_ELEMTNS.name;
        elementBtnContainerChild.appendChild(nameEl);
        // temperature
        var tempEl = document.createElement('span');
        tempEl.id = elementId + "_" + LIST_ELEMTNS.temp;
        elementBtnContainerChild.appendChild(tempEl);
        // pressure
        var pressEl = document.createElement('span');
        pressEl.id = elementId + "_" + LIST_ELEMTNS.pressure;
        elementBtnContainerChild.appendChild(pressEl);
        //icon 
        var iconEl = document.createElement('img');
        iconEl.src = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
        iconEl.id = elementId + "_" + LIST_ELEMTNS.icon;
        // remove button
        var removeBtnEl = document.createElement('button');
        removeBtnEl.className = "city-list-item-removeBtn";
        removeBtnEl.addEventListener('click', function (e) { return _this.removeCity(weatherData.id); });
        // activation
        elementBtn.addEventListener('click', function () {
            _this.mainContext.changeActiveCity(weatherData.id);
        });
        // appending
        elementBtnContainer.appendChild(elementBtnContainerChild);
        elementBtnContainer.appendChild(iconEl);
        elementBtn.appendChild(elementBtnContainer);
        element.appendChild(elementBtn);
        element.appendChild(removeBtnEl);
        wrapper.appendChild(element);
        this.populateListElement(element, weatherData);
    };
    UI.prototype.renderWeatherList = function (weatherData, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (force) {
            var wrapper = document.getElementById('cityList');
            wrapper.innerHTML = null;
        }
        weatherData.forEach(function (data) {
            var elementId = "listEl_" + data.id;
            var element = document.getElementById(elementId);
            // to avoid unnecessaary re-rendering of all list, just refresh new content
            if (element)
                _this.populateListElement(element, data);
            else
                _this.renderWeatherElement(data, elementId);
        });
    };
    return UI;
}());
exports.UI = UI;
