import { CANCEL } from 'redux-saga';
import { formatLevel } from './Formatters';

export const fetchLevel = (id) => {
    const xhr = new XMLHttpRequest();
    const promise = new Promise(
        (resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            resolve(formatLevel(id, JSON.parse(xhr.responseText)));
                        } catch (error) {
                            reject(error.message);
                        }
                    } else {
                        reject(xhr.status);
                    }
                }
            };
            xhr.open('GET', `/api/levels/${id}`, true);
            xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
            xhr.send();
        }
    ).catch((error) => {
        // console.error(error);
    });
    promise[CANCEL] = () => {
        xhr.abort();
    };
    return promise;
};
