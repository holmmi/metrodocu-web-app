'use strict';

const getFormattedTimestamp = () => {
    const time = new Date();
    const hours = time.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return time.getFullYear() + "-" 
        + (time.getMonth() < 10 ? `0${time.getMonth()}` : time.getMonth()) + "-"
        + (time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()) + " "
        + hours;
};

module.exports = {
    getFormattedTimestamp
};