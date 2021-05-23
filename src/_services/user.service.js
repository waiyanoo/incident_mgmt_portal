import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    create,
    update,
    getAll,
    getById
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function create({fullName, email, role, password}) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, role, password })
    };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}
function update({id, fullName, email, role, password}) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, role, password })
    };
    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}
