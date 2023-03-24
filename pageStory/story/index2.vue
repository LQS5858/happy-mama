<template>
  <view class="story-wrapper">

    <view class="content-text">
      <towxml :nodes="contentFormat" />
    </view>
    <view @tap="audioHandler"
          class="iconfont icon-a-10-01 audio-icon pos-fix"></view>
  </view>
</template>
<script>
import towxml from '@/static/towxml/towxml'

import { saveStore, genterStory } from '@/apiServices/story'
import { StreamSource } from '@/utils/eventSource'
import { mapGetters } from 'vuex'
import { audioLength, generateStoreTimeOut } from '@/config'
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
      content: '',
      eventSource: null,
      options: {},
    }
  },
  components: {
    towxml,
  },
  computed: {
    ...mapGetters({
      token: 'basic/token',
    }),
    contentFormat() {
      if (!this.content) return
      return this.towxmlFunc(this.content, 'markdown')
    },
  },
  onLoad(options) {
    console.log('options~~', options)
    this.options = options
    // this.gengerStory()
    this.websocketStory()
  },
  onShow() {},
  methods: {
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
        const [res] = await genterStory(body)
          .catch()
          .finally(() => uni.hideLoading())
        this.content = res || ''
        this.saveStore()
        this.textToSpeech()
      } catch (error) {
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
      if (!this.audioUrl) return
      let innerAudioContext = uni.createInnerAudioContext()
      innerAudioContext.src = this.audioUrl
      innerAudioContext.play()
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
    right: 0;
    bottom: 80rpx;
  }
}
</style>
