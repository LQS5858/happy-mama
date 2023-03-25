

import { HTTP } from '../http'

export const genterStory = (body = {}, showError = true, showLoading = false) => {
  return HTTP.POST({ url: '/api/generateStory', data: body, showLoading, showError }).then(res => [res, null]).catch(err => [null, err])
}
// /api/saveStory


export const saveStore = (body = {}, showError = true, showLoading = false) => {
  return HTTP.POST({
    url: '/api/saveStory', data: body, showLoading, showError, header: { 'Content-type': 'application/x-www-form-urlencoded' },
  }).then(res => [res, null]).catch(err => [null, err])
}


// api/getAudio

export const getAudio = (body = {}, showError = false, showLoading = false) => {
  return HTTP.GET({
    url: '/api/getAudio', data: body, showLoading, showError, header: { 'Content-type': 'application/x-www-form-urlencoded' },
  }).then(res => [res, null]).catch(err => [null, err])
}

