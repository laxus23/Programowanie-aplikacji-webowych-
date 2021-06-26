"use strict";
exports.__esModule = true;
exports.Main = void 0;
require("./style.scss");
var apiCaller_1 = require("./apiCaller");
var UI_1 = require("./UI");
var ACTIVE_CITY_KEY = "active_city";
var Main = /** @class */ (function () {
    function Main() {
        this.activeCity = Number(localStorage.getItem(ACTIVE_CITY_KEY));
        this.apiCaller = new apiCaller_1.ApiCaller();
        this.UI = new UI_1.UI(this);
        this.weatherData = this.apiCaller.getData();
        this.setActiveCity();
        this.initRefresher();
        this.bindInputEvents();
        this.UI.renderWeatherList(this.weatherData);
    }
    Main.prototype.initRefresher = function () {
        var _this = this;
        // Refresh data every hour
        setInterval(function () {
            _this.apiCaller.refreshData().then(function (currentData) {
                _this.weatherData = currentData;
                _this.UI.renderWeatherList(_this.weatherData);
            });
            if (_this.activeCity) {
                _this.setActiveCity();
            }
        }, 3600000);
    };
    Main.prototype.bindInputEvents = function () {
        var _this = this;
        var weatherForm = document.getElementById('weatherForm');
        var cityButton = document.getElementById('cityButton');
        var cityInput = document.getElementById('cityInput');
        weatherForm.addEventListener('submit', function (event) {
            event.preventDefault();
            _this.apiCaller.callData(cityInput.value).then(function (code) {
                if (Number(code) !== 200) {
                    _this.UI.showApiError();
                }
                _this.weatherData = _this.apiCaller.getData();
                _this.UI.renderWeatherList(_this.weatherData);
            });
            cityInput.value = '';
            cityButton.disabled = true;
        });
        cityInput.addEventListener('input', function (event) {
            if (event.target.value.length > 0)
                cityButton.disabled = false;
            else
                cityButton.disabled = true;
        });
    };
    Main.prototype.setActiveCity = function () {
        var _this = this;
        var activeCity = this.weatherData.find(function (city) { return city.id === _this.activeCity; });
        if (activeCity) {
            this.apiCaller.getForecastData(activeCity.coord.lat, activeCity.coord.lon).then(function (activeForecast) {
                _this.activeCityData = activeForecast;
                _this.UI.renderMainView(_this.activeCityData, activeCity);
            });
        }
    };
    Main.prototype.changeActiveCity = function (index) {
        this.activeCity = index;
        localStorage.setItem(ACTIVE_CITY_KEY, String(index));
        this.setActiveCity();
    };
    return Main;
}());
exports.Main = Main;
new Main();
