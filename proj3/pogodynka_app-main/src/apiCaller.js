"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.ApiCaller = exports.DATA_KEY = void 0;
exports.DATA_KEY = "weather_data";
var API_KEY = "db7377f93359ecf8f4deebf40f3cd76f";
var ApiCaller = /** @class */ (function () {
    function ApiCaller() {
        this.callData();
    }
    ApiCaller.prototype.callData = function (city) {
        return __awaiter(this, void 0, void 0, function () {
            var weather;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!city) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getWeatherData(city)];
                    case 1:
                        weather = _a.sent();
                        if (weather && weather.cod === 200) {
                            this.saveData(weather);
                        }
                        return [2 /*return*/, weather.cod];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Data refresh rate and return a new city weather data
    ApiCaller.prototype.refreshData = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var currentCities, newCities;
            var _this = this;
            return __generator(this, function (_b) {
                currentCities = ((_a = JSON.parse(localStorage.getItem(exports.DATA_KEY))) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v.name; })) || [];
                newCities = Promise.all(currentCities.map(function (city) { return __awaiter(_this, void 0, void 0, function () {
                    var apiURL, weatherResp, weatherData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=metric";
                                return [4 /*yield*/, fetch(apiURL)];
                            case 1:
                                weatherResp = _a.sent();
                                return [4 /*yield*/, weatherResp.json()];
                            case 2:
                                weatherData = _a.sent();
                                this.saveData(weatherData);
                                return [2 /*return*/, weatherData];
                        }
                    });
                }); }));
                return [2 /*return*/, newCities];
            });
        });
    };
    // Generate weather data for the city API call.
    ApiCaller.prototype.getWeatherData = function (city) {
        return __awaiter(this, void 0, void 0, function () {
            var apiURL, weatherResp, weatherData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=metric";
                        return [4 /*yield*/, fetch(apiURL)];
                    case 1:
                        weatherResp = _a.sent();
                        return [4 /*yield*/, weatherResp.json()];
                    case 2:
                        weatherData = _a.sent();
                        return [2 /*return*/, weatherData];
                }
            });
        });
    };
    // Getting the forecast data from open weather map
    ApiCaller.prototype.getForecastData = function (lat, long) {
        return __awaiter(this, void 0, void 0, function () {
            var apiURL, forecastResp, forecastData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly&appid=" + API_KEY + "&units=metric";
                        return [4 /*yield*/, fetch(apiURL)];
                    case 1:
                        forecastResp = _a.sent();
                        return [4 /*yield*/, forecastResp.json()];
                    case 2:
                        forecastData = _a.sent();
                        forecastData.daily = forecastData.daily.slice(0, 10);
                        return [2 /*return*/, forecastData];
                }
            });
        });
    };
    // Save data to local storage and avoid refresh if there is data.
    ApiCaller.prototype.saveData = function (data) {
        var currentData = this.getData();
        var indexInLS = currentData.findIndex(function (val) { return val.id === data.id; });
        if (indexInLS !== -1) {
            currentData[indexInLS] = data;
            localStorage.setItem(exports.DATA_KEY, JSON.stringify(currentData));
            return;
        }
        localStorage.setItem(exports.DATA_KEY, JSON.stringify(__spreadArray(__spreadArray([], currentData), [data])));
    };
    ApiCaller.prototype.getData = function () {
        var data = localStorage.getItem(exports.DATA_KEY);
        if (data)
            return JSON.parse(data);
        return [];
    };
    return ApiCaller;
}());
exports.ApiCaller = ApiCaller;
