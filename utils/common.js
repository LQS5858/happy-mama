import { postLogin, checkLogin, getRole, registerUser } from '@/apiServices/userInfo'
import store from '@/store'
class Login {
  async registerUser (body, showError = false, showLoading = false) {
    try {
      const [res, err] = await registerUser(body, showError, showLoading).catch(err => [null, error])
      return [res, err]
    } catch (error) {
      return [null, error]
    }

  }
  async loginRequest (callback) {
    try {
      uni.login({
        success: async (resData) => {
          const { code } = resData || {}
          const body = {
            jscode: code
          }

          const [res, error] = await postLogin(body).catch() || []

          console.log('login~~', res, error);
          if (res?.token) {
            uni.setStorageSync('token', res?.token)
            store.commit('basic/SAVE_REGISTERINFO', res)
            callback(res)
          }
        },
        fail (error) {
          callback()
          return error
        }
      })

    } catch (error) {
      console.log(error);
      callback()
      return error
    }
  }
  async getRoleInfo () {
    try {
      const [res] = await getRole().catch()
      console.log('role', res);
      uni.setStorageSync('userRoles', res?.userRoles)
      store.commit('basic/SAVE_USERROLES', res?.userRoles)
      return [res]
    } catch (error) {
      return error
    }
  }
  async getPhoneNumber (data) {
    let res = data?.detail || {}
    if (res?.errMsg && res?.errMsg == 'getPhoneNumber:fail user deny') {
      return
    }
    try {
      console.log('data', res, res.iv, res.encryptedData)
      let iv = res?.iv
      let encryptedData = res?.encryptedData
      this.loginRequest(async (result) => {
        if (!result?.token) return
        const body = {
          token: result?.token,
          encryptedData,
          iv,
        }
        console.log('参数～～', body)
        if (!result?.isRegister) {
          const [result_, err] =
            (await this.registerUser(body).catch()) || []
          console.log('register~~', result)
        }

        const [res] = (await this.getRoleInfo().catch()) || []
        console.log('role', res)
      })
    } catch (error) {
      console.log(error)
    }
  }
  async checkLoginStatus () {
    try {
      const [res, err] = await checkLogin().catch()
      console.log('cheklogin~~,res,err', res, res?.code, res?.code == -403)
      if (res?.code == -403) {
        uni.removeStorageSync('userRoles')
        store.commit('basic/SAVE_REGISTERINFO', {})
        store.commit('basic/SAVE_USERROLES', [])
        uni.removeStorageSync('token');
      }
      return [res, err]
    } catch (error) {
      console.log(error);
      return [null, error]
    }
  }
}

export const loginInstance = new Login()


export function optional (obj = {}, ...rest) {
  let tmp = obj
  for (const key in rest) {
    const name = rest[key]
    tmp = tmp?.[name]
  }
  return tmp ?? ''
}