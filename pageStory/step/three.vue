<template>
  <view class="step-three-wrapper bg-color">
    <text class="text-center title">选择一个角色</text>
    <view class="flex-row avatar-wrapper">
      <view class="avatar-icon service-icon-wrapper  flex-row pos-rel"
            :class="curUser==($$(item,'id'))?'service-icon':''"
            v-for="item in userRoles"
            @tap="()=>activeAvatar(item)"
            :key="$$(item,'age')">
        <u-avatar :src="$$(item,'headimgurl')"
                  shape="square"></u-avatar>
        <view @tap="()=>deleteHandler(item)"
              class="delete-icon-wrapper">
          <u-icon class="delete-icon"
                  color="#e45656"
                  name="minus-circle-fill"></u-icon>
        </view>
      </view>
      <view class="avatar-icon plus-icon flex-row"
            v-if="!userRoles||(userRoles&&userRoles.length<3)"
            @tap="addPlus">
        <u-icon name="plus"
                class="plus-icon"
                color="#2979ff"
                size="28"></u-icon>

      </view>

    </view>
    <view class="title_1 text-center">简要描述您对故事的想法:</view>
    <textarea v-model="keywords"
              class="u-textarea"
              :adjust-position="true"
              :cursor-spacing="150"
              maxlength="300"
              placeholder="一两个词,一两句话就够了,我们将用它来创造您的故事情节"></textarea>

  </view>
</template>
<script>
import { loginInstance } from '@/utils/common'
import { isEmpty } from 'lodash'
import { deleteRole } from '@/apiServices/userInfo'
import { mapState } from 'vuex'
export default {
  name: 'ThreeStep',
  data() {
    return {
      keywords: '',
      curUser: '',
      avatarLeft: process.env.IMAGE_URL + 'boy.png',
      avatarRight: process.env.IMAGE_URL + 'girl.png',
    }
  },
  props: {
    roleId: {
      type: String,
    },
    words: {
      type: String,
    },
  },
  watch: {
    curUser: {
      handler(val) {
        if (!val) return
        this.$emit('update:roleId', val)
      },
      immidate: true,
      deep: true,
    },
    keywords: {
      handler(val) {
        if (!val) return
        this.$emit('update:words', val)
      },
      immidate: true,
      deep: true,
    },
  },
  computed: {
    ...mapState({
      userRoles: (state) => state.basic.userRoles,
    }),
  },

  mounted() {
    this.setDefaultRole()
    this.refreshCache()
  },
  methods: {
    async refreshCache() {
      try {
        loginInstance
          .getRoleInfo()
          .finally(() => uni.stopPullDownRefresh())
          .catch()
      } catch (error) {
        console.log(error)
      }
    },
    async setDefaultRole() {
      if (isEmpty(this.userRoles)) return
      this.curUser = this.userRoles?.[0]?.['id']
      console.log('curUser~~', this.curUser)
    },
    async activeAvatar({ id }) {
      this.curUser = id
    },
    async addPlus() {
      this.$emit('changeStep', 0)
    },
    async deleteHandler({ id }) {
      const body = {
        userRoleId: id,
      }
      await deleteRole(body).catch()
      loginInstance.getRoleInfo()
    },
  },
}
</script>
<style  lang='scss'>
.step-three-wrapper {
  box-sizing: border-box;
  /deep/.u-avatar__image--square {
    width: 100%;
    height: 100%;
  }
  .service-icon {
    background: #f1a532 !important;
  }
  .title_1 {
    margin: 30rpx;
  }
  .title {
    margin: 68rpx 0 50rpx;
  }

  .avatar-wrapper {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  /deep/ .u-avatar--square {
    width: 100% !important;
    height: 100% !important;
  }
  .avatar-icon {
    width: 160rpx;
    height: 160rpx;
    border-radius: 20rpx;
    margin: 0 30rpx 30rpx 0;
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
