<script>
import { loginInstance } from '@/utils/common'
export default {
  onLaunch: function () {
    console.log('App Launch')
    this.login()
  },
  globalData() {},
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    async login() {
      try {
        console.log('检查登录是否过期～～')
        // 检查是否过期
        const [status] = (await loginInstance.checkLoginStatus()) || []
        console.log('status', status, Number(status?.code) == -403)
        if (Number(status?.code) === 1) {
          return
        }
        if (Number(status?.code) === -403) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userRoles')
          this.$store.commit('basic/SAVE_REGISTERINFO', {})
          this.$store.commit('basic/SAVE_USERROLES', [])
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uni_modules/jo-markdown/components/jo-markdown/main.css';
@import '@/assets/styles/global.scss';
@import '@/assets/font/iconfont.css';
@import '@/uni_modules/uview-ui/index.scss';
</style>
