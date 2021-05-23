import config from 'config';
import {authHeader, handleResponse} from "@/_helpers";

export const incidentService = {
    create,
    update,
    getAll,
    getById
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/incidents`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/incidents/${id}`, requestOptions).then(handleResponse);
}

function create({typeOfIncident, location, datetimeOfIncident, nameOfAffected, nameOfSupervisor, descriptionOfIncident, rootCaseOfAccident, nameOfHandler}) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ typeOfIncident, location, datetimeOfIncident, nameOfAffected, nameOfSupervisor, descriptionOfIncident, rootCaseOfAccident, nameOfHandler })
    };
    return fetch(`${config.apiUrl}/incidents`, requestOptions).then(handleResponse);
}
function update({id, typeOfIncident, location, datetimeOfIncident, nameOfAffected, nameOfSupervisor, descriptionOfIncident, rootCaseOfAccident, nameOfHandler}) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ typeOfIncident, location, datetimeOfIncident, nameOfAffected, nameOfSupervisor, descriptionOfIncident, rootCaseOfAccident, nameOfHandler })
    };
    return fetch(`${config.apiUrl}/incidents/${id}`, requestOptions).then(handleResponse);
}
