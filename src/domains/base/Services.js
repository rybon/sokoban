import { defaultFormatter } from './formatters'

const baseRequest = (
  { method = 'GET', url, body, cancellationToken },
  formatter = defaultFormatter
) => {
  const xhr = new XMLHttpRequest()
  // eslint-disable-next-line compat/compat
  const promise = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            resolve(formatter(JSON.parse(xhr.responseText)))
          } catch (error) {
            reject(error.message)
          }
        } else {
          reject(xhr.status)
        }
      }
    }
    xhr.open(method, url)
    if (method === 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    }
    xhr.setRequestHeader('Accept', 'application/json; charset=utf-8')
    if (method === 'POST') {
      xhr.send(JSON.stringify(body))
    } else {
      xhr.send()
    }
  }).catch(error => {
    console.error(error) // eslint-disable-line no-console
  })
  if (cancellationToken) {
    promise[cancellationToken] = () => {
      xhr.abort()
    }
  }
  return promise
}

export const getRequest = ({ url, cancellationToken }, formatter) =>
  baseRequest({ url, cancellationToken }, formatter)

export const postRequest = ({ url, body, cancellationToken }, formatter) =>
  baseRequest({ method: 'POST', url, body, cancellationToken }, formatter)
