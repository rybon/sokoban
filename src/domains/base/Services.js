import { defaultFormatter } from './formatters'

const baseRequest = (
  { method = 'GET', url, content, cancellationToken },
  formatter = defaultFormatter
) => {
  const xhr = new XMLHttpRequest()
  // eslint-disable-next-line compat/compat
  const promise = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
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
      xhr.send(JSON.stringify(content))
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

export const postRequest = ({ url, content, cancellationToken }, formatter) =>
  baseRequest({ method: 'POST', url, content, cancellationToken }, formatter)
