import { configHeader } from '@/config'
import store from '@/store'
class HttpInstance {
  request ({
    url,
    data = {},
    showLoading = false,
    showError = false,
    isPagination = false,
    header = {},
    method = "GET"
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method, header, showLoading, showError, isPagination);
    });
  }
  //是否分页接口
  GET (params) {
    return this.request({ ...params, method: "GET" });
  }

  POST (params) {
    return this.request({ ...params, method: "POST" });
  }

  PUT (params) {
    return this.request({ ...params, method: "PUT" });
  }

  setStorage (e) { //设置缓存

  }

  _request (url, resolve, reject, data, method, header, showLoading, showError, isPagination) {
    if (showLoading) {
      uni.showLoading({
        icon: 'none',
        title: '加载中～～'
      });
    }

    header = {
      ...header,
      ...configHeader.header
    }
    let reg = /http/gi
    url = reg.test(url) ? url : process.env.api_base_url + url
    const token = uni.getStorageSync('token');
    if (token) {
      header = {
        'apiToken': token,
        ...header
      }
    }

    uni.request({
      url: url,
      method: method,
      data: data,
      header,
      success: res => {
        res.success = res.data;
      },
      fail: error => {
        error.fail = error;
      },
      complete: (response) => {
        try {
          if (response.success) {
            uni.hideLoading();
            if (showError && Number(response?.data?.code) !== 1) {
              uni.showToast({
                title: response?.data?.msg || 'error',
                icon: 'none'
              })
            }
            const code = response?.data?.code;
            if (+code == -403 && !(url && url.includes('tokenVerify'))) {
              store.commit('basic/CLEAR_LOGIN_INFO')
              uni.navigateTo({
                url: '/pages/index/index'
              });
            }
            if (code == 6000 || code == 6001) {
              uni.clearStorageSync();
              return false
            }
            console.log('res~~', response);
            if (Number(code) === 1 && !isPagination) {
              resolve(response?.data?.data);
            } else if (Number(code) === 1 && isPagination) {
              resolve(response?.data);
            }
            else if (code === 501 || code === 50010) {
              return;
            } else if (20000 < code < 20010) {
              resolve(response?.data);
            } else if (code === 20010) {
              resolve(response?.data);
            } else {
              resolve(response?.data);
            }
          } else {
            uni.hideLoading();
            uni.getNetworkType({
              success (res) {
                const networkType = res.networkType;
                if (networkType === 'unknown' || networkType === 'none') {
                  uni.showToast({
                    title: '网络不佳，请稍后重试',
                    icon: "none",
                    duration: 2000
                  });
                }
              }

            });
            console.info('请求失败：', response.fail);
            store.commit('basic/CLEAR_LOGIN_INFO')
            uni.showToast({
              title: '亲,网络开小差,请检查网络下拉刷新重试～～',
              duration: 2000,
              icon: "none"
            });
            reject(response.fail);
          }
        } catch (error) {

        }


      }
    });
  }

}
let HTTP = new HttpInstance()
export { HTTP };
