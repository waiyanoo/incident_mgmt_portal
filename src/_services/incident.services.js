import config from 'config';
import {authHeader, handleResponse} from "@/_helpers";

export const incidentService = {
    create,
    update,
    getAll,
    getById,
    acknowledge,
    resolve
};

function getAll(sorting, filter, pageSize, page) {
    let url = `${config.apiUrl}/incidents`;
    if(sorting){
       url += `?${sorting}`;
    }
    if(filter){
        url += filter;
    }
    url += `&page=${page}&pageSize=${pageSize}`
    const requestOptions = {method: 'GET', headers: authHeader()};
    return fetch(url, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {method: 'GET', headers: authHeader()};
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

function acknowledge(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({})
    };
    return fetch(`${config.apiUrl}/incidents/${id}/acknowledge`, requestOptions).then(handleResponse);
}
function resolve({id, comment}) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({comment})
    };
    return fetch(`${config.apiUrl}/incidents/${id}/resolve`, requestOptions).then(handleResponse);
}
