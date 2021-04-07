'use strict';

const users = [
    {
        id: 1,
        first_name: "Testi",
        last_name: "Testaaja",
        email: "test@example.com",
        password: "Test123"
    },
    {
        id: 2,
        first_name: "Testi",
        last_name: "Testeri",
        email: "test@example.fi",
        password: "Test1234"
    }
];

const getUserByEmailAndPassword = (email, password) => {
    return users.filter(user => user.email === email && user.password === password)[0];
};

const getUserById = id => {
    return users.filter(user => user.id === id)[0];
}

module.exports = {
    getUserByEmailAndPassword,
    getUserById
}