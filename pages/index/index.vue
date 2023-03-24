<template>
  <view class="bg-color home-wrapper">
    <view class="content-wrapper pos-rel">
      <view>{{to}}</view>
      <text class="title text-center">HappyMama欢迎您</text>
      <text>一个神奇的地方,您和您的孩子可以产生故事,成为自己冒险的主角,利用最先进的语言处理技术,我们创造出独特的、引人入胜的故事,相信孩子们会喜欢。</text>
      <u-button type="success"
                @tap="jumpStep"
                v-if="token"
                icon="checkbox-mark"
                iconColor="#fe6e63">进入!</u-button>
      <u-button v-else
                type="success"
                iconColor="#fe6e63"
                open-type="getPhoneNumber"
                @getphonenumber="getPhoneNumber"
                icon="checkbox-mark">登录!</u-button>
      <view class="flex-row icon-wrapper pos-as">
        <image class="icon_1"
               :src="robotLeft"></image>
        <view class="flex-row left-box-wrapper">
          <image class="icon_2"
                 :src="robotRight_1"></image>
          <image class="icon_3"
                 :src="robotRight"></image>
        </view>
      </view>
    </view>
    <LoginTip v-if="!token"></LoginTip>
  </view>
</template>

<script>
import { loginInstance } from '@/utils/common'
import { mapState, mapGetters } from 'vuex'
import LoginTip from '@/components/login-tip'
export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  components: {
    LoginTip,
  },

  computed: {
    ...mapState({
      token: (state) => state.basic?.registerInfo?.token,
      userRoles: (state) => state.basic.userRoles,
    }),
    robotLeft() {
      return process.env.IMAGE_URL + 'yellow-raising-hands-bot.png'
    },
    robotRight() {
      return process.env.IMAGE_URL + 'orange-bot.png'
    },
    robotRight_1() {
      return process.env.IMAGE_URL + 'gray-bot.png'
    },
  },
  onLoad() {},
  mounted() {},
  methods: {
    getPhoneNumber(data) {
      loginInstance.getPhoneNumber(data)
    },
    async postLogin() {
      await loginInstance.loginRequest()
    },
    async jumpStep() {
      if (this.userRoles?.[0]?.['age']) {
        return uni.navigateTo({
          url: '/pageStory/step/index?step=2',
        })
      }
      uni.navigateTo({
        url: '/pageStory/step/index',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.home-wrapper {
  height: 100vh;
  box-sizing: border-box;
  padding: 20rpx;
  .left-box-wrapper {
    align-items: flex-end;
  }
  /deep/ .login-btn {
    .u-button {
      height: 60rpx !important;
      border: none !important;
      color: $primary-bg-color !important;
      background: #fff !important;
    }
  }
  /deep/.u-icon__icon {
    color: #fff !important;
  }
  .icon-wrapper {
    margin-top: auto;
    bottom: 0;
    left: 0;
    align-items: flex-end;
    right: 0;
  }
  .icon_1 {
    width: 150rpx;
    height: 200rpx;
  }
  .icon_2 {
    width: 150rpx;
    height: 180rpx;
  }
  .icon_3 {
    width: 180rpx;
    height: 350rpx;
  }
  /deep/.u-button--success {
    margin-top: 120rpx;
    width: 90% !important;
  }
  .content-wrapper {
    background: #fff;
    height: 100%;
    box-sizing: border-box;
    border-radius: 10rpx;
    padding: 0 30rpx;
    .title {
      font-size: 32rpx;
      font-weight: 600;
      margin: 60rpx 0 30rpx;
    }
  }
}
</style>
