'use strict';

const users = [
    {
        id: 1,
        first_name: 'Testi',
        last_name: 'Testaaja',
        email: 'test@example.com',
        password: '$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS'               //1234
    },
    {
        id: 2,
        first_name: 'Testi',
        last_name: 'Testeri',
        email: 'test@example.fi',
        password: '$2a$04$hwtToRaZMigg8tHbzcxJaO/XFN9i70YosDn2WAnpr18WlLS5Yc.KG'              //Test1234
    }
];

const getUserLogin = (email) => {
    console.log(email);
    return users.filter(user => user.email === email.toString())[0];
};

const getUserByEmailAndPassword = (email, password) => {
    return users.filter(user => user.email === email && user.password === password)[0];
};

const getUserById = id => {
    return users.filter(user => user.id === id)[0];
}

module.exports = {
    getUserLogin,
    getUserByEmailAndPassword,
    getUserById
}