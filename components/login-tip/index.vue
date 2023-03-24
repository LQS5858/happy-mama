<template>
  <view class="pos-fix tip-login  flex-row">
    <view class="login-title">一键登录享受更多服务额～～</view>
    <view class="login-btn">
      <u-button open-type="getPhoneNumber"
                type="default"
                @getphonenumber="getPhoneNumber"
                border="none">一键登录</u-button>
    </view>
  </view>
</template>
<script>
import { loginInstance } from '@/utils/common'
export default {
  methods: {
    getPhoneNumber: async function (data) {
      let res = data?.detail || {}
      if (res?.errMsg && res?.errMsg == 'getPhoneNumber:fail user deny') {
        return
      }
      try {
        console.log('data', res, res.iv, res.encryptedData)
        let iv = res?.iv
        let encryptedData = res?.encryptedData
        loginInstance.loginRequest(async (result) => {
          if (!result?.token) return
          const body = {
            token: result?.token,
            encryptedData,
            iv,
          }
          console.log('参数～～', body)
          if (!result?.isRegister) {
            const [result_, err] =
              (await loginInstance.registerUser(body).catch()) || []
            console.log('register~~', result)
          }

          const [res] = (await loginInstance.getRoleInfo().catch()) || []
          console.log('role', res)
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
<style  lang="scss">
.tip-login {
  z-index: 22;
  height: 100rpx;
  box-sizing: border-box;
  left: 0;
  right: 0;
  bottom: env(safe-area-inset-bottom);
  background: $primary-bg-color;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  .login-title {
    color: #fff;
    padding-left: 20rpx;
  }
  .login-btn {
    margin-right: 20rpx;
    .u-button {
      height: 60rpx !important;
      border: none !important;
      color: $btn-bg-color !important;
      background: #fff !important;
    }
  }
}
</style>
