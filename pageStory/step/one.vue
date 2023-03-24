<template>
  <view class="step-wrapper bg-color">
    <text class="text-center title">让我们为您的故事选一个主角开始</text>
    <view class="flex-row avatar-wrapper">
      <view class="avatar-icon flex-row"
            :class="String(curActive)==='0'?'avatar-active':''"
            @tap="()=>changeActive(0)">
        <u-avatar :src="avatarRight"
                  shape="square"></u-avatar>
      </view>
      <view class="avatar-icon flex-row"
            :class="String(curActive)==='1'?'avatar-active':''"
            @tap="()=>changeActive(1)">
        <u-avatar :src="avatarLeft"
                  shape="square"></u-avatar>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'OneStep',
  data() {
    return {
      curActive: 1,
      avatarLeft: process.env.IMAGE_URL + 'boy.png',
      avatarRight: process.env.IMAGE_URL + 'girl.png',
    }
  },
  props: {
    gender: {
      type: [String, Number],
    },
  },
  watch: {
    curActive: {
      handler(val) {
        if (!String(val)) return
        console.log('watch~~', val)
        this.$emit('update:gender', val)
      },
      immidate: true,
      deep: true,
    },
  },
  methods: {
    changeActive(id) {
      this.curActive = id
    },
  },
  mounted() {
    this.$emit('update:gender', this.curActive)
  },
}
</script>
<style scoped lang='scss' >
.step-wrapper {
  box-sizing: border-box;
  padding: 0 80rpx;
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
    box-shadow: 0 0.2rem 0.5rem #189b25 !important;
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
