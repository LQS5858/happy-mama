import { HTTP } from '../http'

export const postLogin = (body = {}, showError = true, showLoading = false) => {
  return HTTP.POST({ url: '/login', data: body, showLoading, showError }).then(res => [res, null]).catch(err => [null, err])
}

export function checkLogin (body = {}, showError = false, showLoading = false) {
  return HTTP.GET({ url: '/tokenVerify', data: body, showLoading, showError, isPagination: true }).then(res => [res, null]).catch(err => [null, err])
}

export function getRole (body = {}, showError = false, showLoading = false) {
  return HTTP.GET({ url: '/api/getAllUserRole', data: body, showLoading, showError }).then(res => [res, null]).catch(err => [null, err])
}

// api/delUserRole

export function deleteRole (body = {}, showError = true, showLoading = false) {
  return HTTP.POST({ url: '/api/delUserRole', data: body, showLoading, showError }).then(res => [res, null]).catch(err => [null, err])
}

// api/createUserRole
export function createRole (body = {}, showError = true, showLoading = true) {
  return HTTP.POST({ url: '/api/createUserRole', data: body, showLoading, showError }).then(res => [res, null]).catch(err => [null, err])
}


export function registerUser (body = {}, showError = false, showLoading = false) {
  return HTTP.POST({
    url: '/register', data: body, showLoading, showError, isPagination: false,
    header: { 'Content-type': 'application/x-www-form-urlencoded' },
  }).then(res => [res, null]).catch(err => [null, err])
}