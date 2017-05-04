export const fetchScores = () => {
    const xhr = new XMLHttpRequest();
    return new Promise(
        (resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        } catch (error) {
                            reject(error.message);
                        }
                    } else {
                        reject(xhr.status);
                    }
                }
            };
            xhr.open('GET', '/api/scores', true);
            xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
            xhr.send();
        }
    ).catch((error) => {
        console.error(error); // eslint-disable-line no-console
    });
};

export const persistScores = (scores) => {
    const xhr = new XMLHttpRequest();
    return new Promise(
        (resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            resolve();
                        } catch (error) {
                            reject(error.message);
                        }
                    } else {
                        reject(xhr.status);
                    }
                }
            };
            xhr.open('POST', '/api/scores', true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(scores));
        }
    ).catch((error) => {
        console.error(error); // eslint-disable-line no-console
    });
};
