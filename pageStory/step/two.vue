<template>
  <view class="step-two-wrapper bg-color">
    <text class="text-center title">{{title}}</text>
    <u--form labelPosition="left"
             :model="formData"
             :rules="rules"
             :errorType="'toast'"
             ref="form1">
      <u-form-item prop="name"
                   borderBottom
                   ref="item1">
        <u--input placeholder="输入姓名"
                  border="none"
                  @input="()=>inputHandler('name')"
                  type="text"
                  v-model="formData.name"></u--input>

      </u-form-item>
      <u-form-item prop="age"
                   borderBottom
                   ref="item1">
        <u--input placeholder="输入年龄"
                  type="text"
                  border="none"
                  @input="()=>inputHandler('age')"
                  v-model.trim="formData.age"></u--input>

      </u-form-item>

    </u--form>
  </view>
</template>
<script>
export default {
  name: 'TwoStep',
  data() {
    return {
      avatarLeft: process.env.IMAGE_URL + 'boy.png',
      avatarRight: process.env.IMAGE_URL + 'girl.png',
      formData: {
        name: '',
        age: '',
      },

      rules: {
        name: {
          required: true,
          message: '请输入姓名',
          trigger: ['blur', 'change'],
        },
        age: {
          required: true,
          message: '请输入年龄',
          trigger: ['blur', 'change'],
        },
      },
    }
  },
  props: {
    gender: {
      type: [String, Number],
    },
    form: {
      type: Object,
    },
  },

  watch: {
    formData: {
      handler(val) {
        if (!val) return
        this.$emit('update:form', val)
      },
      immidate: true,
      deep: true,
    },
  },
  computed: {
    title() {
      if (+this.gender == 0) {
        return '不错的选择,给她起一个名字吧'
      }
      return '不错的选择,给他起一个名字吧'
    },
  },
  methods: {
    async inputHandler(type) {
      const obj = {
        age: () => {
          let id = setTimeout(() => {
            this.formData.age = this.formData.age.replace(/[^\d.]/gi, '')
            id = clearTimeout(id)
          })
        },
        name: () => {
          let id = setTimeout(() => {
            this.formData.name = this.formData.name.replace(/\s/gi, '')
            id = clearTimeout(id)
          })
        },
      }
      obj[type]()
    },
    validator_(cb) {
      this.$refs.form1
        .validate()
        .then((res) => {
          cb(true)
        })
        .catch(() => cb(false))
    },
  },
  onReady() {
    this.$refs.form1.setRules(this.rules)
  },
}
</script>
<style scoped lang='scss'>
.step-two-wrapper {
  box-sizing: border-box;

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
