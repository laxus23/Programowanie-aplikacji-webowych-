"use strict";
exports.__esModule = true;
exports.getDay = void 0;
function getDay(dt, timezoneOffset) {
    var date = new Date((dt + timezoneOffset) * 1000);
    var stringDate = date.toLocaleDateString();
    return stringDate;
}
exports.getDay = getDay;
