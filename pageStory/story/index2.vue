<template>
  <view class="story-wrapper">

    <view class="content-text">
      <towxml v-if="content"
              :nodes="contentFormat" />
      <u-empty v-else>
      </u-empty>
    </view>

    <view class="pos-fix icon-fix-wrapper">
      <view @tap="backHandler"
            class="iconfont share-icon icon-fanhui"></view>
      <view class="pos-rel"
            v-if="openShare">
        <button open-type="share"
                class="share-btn pos-as" />
        <view class="iconfont icon-JC_054 share-icon"></view>

      </view>

      <view @tap="audioHandler"
            v-if="audioUrl"
            class="iconfont icon-a-10-01 audio-icon "></view>
    </view>
  </view>
</template>
<script>
import towxml from '@/static/towxml/towxml'
import { getAudio } from '@/apiServices/story'
import { saveStore, genterStory } from '@/apiServices/story'
import { StreamSource } from '@/utils/eventSource'
import { mapGetters } from 'vuex'
import { audioLength, generateStoreTimeOut } from '@/config'
const innerAudioContext = uni.createInnerAudioContext()
export default {
  name: 'story',
  data() {
    return {
      towxmlFunc: require('@/static/towxml/index.js'),
      audioUrl: '',
      keywords: '',
      userRoleId: '',
      userKeywordId: '',
      loading: false,
      storySuccess: false,
      content: '',
      eventSource: null,
      options: {},
      audioStatus: false,
    }
  },
  components: {
    towxml,
  },
  computed: {
    ...mapGetters({
      token: 'basic/token',
    }),
    openShare() {
      return process.env.OPEN_SHARE
    },
    contentFormat() {
      if (!this.content) return
      return this.towxmlFunc(this.content, 'markdown')
    },
  },
  onLoad(options) {
    console.log('options~~', options)
    this.options = options
    this.gengerStory()
  },
  onPullDownRefresh() {
    let id = setTimeout(() => {
      this.gengerStory()
      id = clearTimeout(id)
    })
  },
  onShow() {},
  methods: {
    async getAudio() {
      try {
        if (!this.userKeywordId) return
        const params = {
          userKeywordId: this.userKeywordId,
        }
        const [res] = (await getAudio(params).catch()) || []
        this.audioUrl = res?.filePath || ''
      } catch (error) {
        console.log(error)
      }
    },
    async backHandler() {
      uni.navigateBack()
    },
    async gengerStory() {
      try {
        const body = {
          keywords: this.options?.keywords,
          userRoleId: this.options?.userRoleId,
        }
        uni.showLoading({
          title: '亲,故事正在生成中～～',
          icon: 'none',
        })
        const [res, err] =
          (await genterStory(body)
            .catch()
            .finally(() => {
              uni.hideLoading()
              uni.stopPullDownRefresh()
            })) || []
        console.log('story res~~', res)
        if (err && !res) return
        this.content = res?.content || ''
        this.userKeywordId = res?.userKeywordId || ''
        this.storySuccess = true
        this.getAudio()
      } catch (error) {
        this.storySuccess = false
        console.log(error)
      }
    },
    websocketStory() {
      try {
        uni.showLoading({
          title: '亲,故事正在生成中～～',
          icon: 'none',
        })
        let id = setTimeout(() => {
          uni.hideLoading()
          id = clearTimeout(id)
        }, generateStoreTimeOut)
        this.keywords = this.options?.keywords
        this.userRoleId = this.options?.userRoleId
        this.eventSource = new StreamSource()
        this.eventSource.connect()
        let body = {
          token: this.token,
          userRoleId: this.userRoleId,
          keywords: this.keywords,
        }
        body = body ? JSON.stringify(body) : body
        // setTimeout(() => {
        this.eventSource.subscribe(body, (data) => {
          console.log('文本～～', data)
          this.content += data?.data
          if (+data?.code == 1) {
            uni.hideLoading()
          }
          if (+data?.code == 10) {
            this.storySuccess = true
            this.userKeywordId = data?.userKeywordId
            this.saveStore()
            this.textToSpeech()
          }
        })
        // }, 5000)
      } catch (error) {
        console.log(error)
      }
    },
    async saveStore() {
      try {
        const body = {
          content: this.content,
          userKeywordId: this.userKeywordId,
        }
        await saveStore(body).catch()
      } catch (error) {
        console.log('save error~~', error)
      }
    },
    async audioHandler() {
      if (!this.audioUrl) {
        uni.showToast({
          title: '亲,没有任何音频文件～～',
          duration: 2000,
          icon: 'none',
        })
        return
      }
      innerAudioContext.src = this.audioUrl
      console.log('播放状态～～', innerAudioContext?.paused)
      if (this.audioStatus) {
        innerAudioContext.pause()
        this.audioStatus = false
        return
      }
      innerAudioContext.play()
      innerAudioContext.onPlay(() => {
        this.audioStatus = true
      })
    },
    formatContent() {
      let data = this.content.replace(/\s/gi, '')

      if (data?.length > audioLength) {
        data = data?.slice(0, audioLength)
      }
      console.log('content~~', data)
      return data
    },
    async textToSpeech() {
      var plugin = requirePlugin('WechatSI')
      let self = this
      let data = this.formatContent()
      plugin.textToSpeech({
        lang: 'zh_CN',
        tts: true,
        content: data,
        success: function (res) {
          console.log('succ tts', res.filename)
          self.audioUrl = res?.filename
        },
        fail: function (res) {
          console.log('fail tts', res)
        },
      })
    },
  },
}
</script>
<style  lang='scss'>
.story-wrapper {
  background: $bg-color;
  /deep/.u-empty {
    height: 100vh;
  }
  .share-icon {
    font-size: 100rpx;
  }
  .share-btn {
    opacity: 0;
    right: 0;
    left: 0;
    z-index: 23;
    top: 0;
    bottom: 0;
  }
  .icon-fix-wrapper {
    right: 20rpx;
    bottom: 80rpx;
  }
  /deep/.h2w {
    min-height: 100vh;
    border-radius: 20rpx;
    margin: 20rpx 0;
    background: #fff;
  }
  .content-text {
    box-sizing: border-box;
    margin: 0 30rpx;
    padding: 30rpx 0;
    white-space: pre-wrap;
  }
  .audio-icon {
    font-size: 100rpx;
  }
}
</style>
