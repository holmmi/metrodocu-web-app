'use strict';

const log_out = (req, res) => {
    req.logout();
    res.redirect("/");
};

module.exports = {
    log_out
};