<template>
  <view class="step-wrapper bg-color">
    <u-steps :current="curStep"
             activeColor="#ff9900"
             inactiveColor="#c8c9cc">
      <u-steps-item>
      </u-steps-item>
      <u-steps-item></u-steps-item>
      <u-steps-item></u-steps-item>
    </u-steps>
    <One :gender.sync="gender"
         v-if="curStep==0"></One>
    <Two ref="form"
         :gender="gender"
         :form.sync="form"
         v-show="curStep==1"></Two>
    <Three v-show="curStep==2"
           ref="stepEnd"
           :words.sync="words"
           :roleId.sync="roleId"
           @changeStep="changeStepHandler"></Three>
    <view class="success-btn-wrapper">
      <u-button type="success"
                @tap="jumpStep"
                icon="checkbox-mark"
                iconColor="#fe6e63">下一步</u-button>
      <text type="info"
            v-if="curStep!==0"
            class="text-center back-text"
            @tap="backHandler">返回</text>

    </view>
  </view>
</template>
<script>
import One from './one.vue'
import { refreshTime } from '@/config'
import { mapState } from 'vuex'
import { isEmpty } from 'lodash'
import { genterStory } from '@/apiServices/story'
import Two from './two.vue'
import Three from './three.vue'
import { loginInstance } from '@/utils/common'
import { createRole } from '@/apiServices/userInfo'

export default {
  name: 'StepIndex',
  data() {
    return {
      gender: 0,
      curStep: 0,
      roleId: '',
      words: '',
      form: {},
      step: '',
      avatarLeft: process.env.IMAGE_URL + 'boy.png',
      avatarRight: process.env.IMAGE_URL + 'girl.png',
    }
  },
  components: {
    One,
    Two,
    Three,
  },

  computed: {
    ...mapState({
      userRoles: (state) => state.basic.userRoles,
    }),
  },
  onLoad(options) {
    this.step = options?.step
    this.setStep()
  },
  onPullDownRefresh() {
    console.log('watch refresh～～')
    let dom = this.$refs?.['stepEnd']
    if (!dom) return
    let id = setTimeout(() => {
      dom?.refreshCache()
      id = clearTimeout(id)
    }, refreshTime)
  },
  methods: {
    async getStory() {
      const body = {
        userRoleId: '',
        keywords: this.words,
      }
      await genterStory(body)
    },
    async createRole() {
      try {
        const body = {
          ...this.form,
          gender: this.gender,
        }
        if (isEmpty(this.form)) return
        const [res] = (await createRole(body).catch()) || []
        if (!res) return
        loginInstance.getRoleInfo()
        return [res]
      } catch (error) {
        return [null, error]
      }
    },

    async changeStepHandler() {
      this.curStep = 0
    },
    async setStep() {
      this.curStep = this.step ? Number(this.step) : this.curStep
    },
    async backHandler() {
      if (+this.curStep < 0) {
        this.curStep = 0
        return
      }
      this.curStep -= 1
    },
    async jumpStep() {
      let self = this
      if (+this.curStep === 1) {
        let dom = this.$refs['form']
        if (!dom) return
        dom.validator_(async (valid) => {
          console.log('form验证～～～', valid, !valid)
          if (!valid) {
            return
          }
          try {
            const [res] = (await this.createRole()) || []
            console.log('role', res)
            if (!res) return
            this.curStep += 1
            uni.showToast({
              title: '亲,已创建角色～～',
              duration: 2000,
            })
          } catch (error) {
            return
          }
        })
      } else if (+this.curStep === 2) {
        const body = {
          keywords: this.words,
          userRoleId: this.roleId,
        }
        console.log('参数～～', body, this.words, this.roleId)
        if (!this.roleId)
          return uni.showToast({
            title: '请选择角色',
            icon: 'none',
            duration: 2000,
          })
        if (!this.words) {
          return uni.showToast({
            title: '亲,请输入关键字～～',
            icon: 'none',
            duration: 2000,
          })
        }
        uni.navigateTo({
          url: `/pageStory/story/index2?keywords=${this.words}&userRoleId=${this.roleId}`,
        })
      } else {
        console.log('curStep~~', this, +this.curStep, +self.curStep)
        this.curStep += 1
        if (+this.curStep > 2) {
          this.curStep = 0
          return
        }
      }
    },
  },
}
</script>
<style scoped lang='scss'>
.step-wrapper {
  height: 100vh;
  box-sizing: border-box;
  padding: 0 80rpx;
  /deep/ .u-avatar__image--square {
    width: 100% !important;
    height: 100% !important;
  }

  /deep/ .delete-icon-wrapper {
    .u-icon__icon {
      padding: 15px;
    }
  }
  /deep/.u-input {
    background: #fff;
    box-shadow: 0 0.2rem 0.5rem #189b25;
  }
  /deep/.avatar-active {
    background: #f9ae3d !important;
    .u-avatar {
      background: #f9ae3d !important;
    }
  }
  /deep/ .service-icon-wrapper {
    .u-icon {
      position: absolute;
      right: -40rpx;
      top: -40rpx;
      z-index: 23;
    }
  }
  /deep/.u-textarea {
    width: 100%;
    background: #fff;
    padding: 20rpx 20rpx 0;
    box-sizing: border-box;
    box-shadow: 0 0.2rem 0.5rem #189b25;
  }

  /deep/.avatar-icon {
    &.plus-icon {
      .u-icon {
        justify-content: center;
        height: 100%;
        width: 100%;
      }
    }
  }

  /deep/.u-input__content__field-wrapper__field {
    height: 100rpx;
    padding-left: 30rpx;
  }

  .back-text {
    color: #8196b5;
    margin-top: 30rpx;
  }
  .title {
    margin: 68rpx 0 50rpx;
  }
  .avatar-wrapper {
    justify-content: space-between;
  }
  /deep/ .u-avatar--square {
    width: 100% !important;
    height: 100% !important;
  }
  .avatar-icon {
    width: 160rpx;
    height: 160rpx;
    border-radius: 20rpx;
    background: #fff;
    &:first-child {
      margin-right: 20rpx;
    }
  }
  /deep/.u-steps-item__wrapper {
    background: $bg-color;
  }
}
</style>
