<template>
  <view class="story-wrapper">
    <button @tap="azureSpeech">azure语音</button>
    <view class="content-text"
          v-html="content"></view>
    <view @tap="audioHandler"
          class="iconfont icon-a-10-01 audio-icon pos-fix"></view>
  </view>
</template>
<script>
import { saveStore, genterStory } from '@/apiServices/story'
import { StreamSource } from '@/utils/eventSource'
import { azureKey, azureRegio } from '@/config'
import { mapGetters } from 'vuex'
import { audioLength, generateStoreTimeOut } from '@/config'
export default {
  name: 'story',
  data() {
    return {
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
  computed: {
    ...mapGetters({
      token: 'basic/token',
    }),
  },
  onLoad(options) {
    console.log('options~~', options)
    this.options = options
    // this.gengerStory()
    // this.websocketStory()
  },
  onShow() {},
  methods: {
    async azureSpeech() {
      try {
        let sdk = require('microsoft-cognitiveservices-speech-sdk')

        let audioFile = './YourAudioFile.wav'
        // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
        const speechConfig = sdk.SpeechConfig.fromSubscription(
          '367af8dca7d44ab5a6ffee5d880b78fe',
          'eastasia'
        )
        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile)

        // The language of the voice that speaks.
        speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaoyouNeural'

        // Create the speech synthesizer.
        var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)
        let text = 'Enter some text that you want to speak >\n>'
        synthesizer.speakTextAsync(
          text,
          function (result) {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              console.log('synthesis finished.')
              let res = sdk.PullAudioOutputStream.create()
              console.log('audio ~~res -audio', res)
            } else {
              console.error(
                'Speech synthesis canceled, ' +
                  result.errorDetails +
                  '\nDid you set the speech resource key and region values?'
              )
            }
            synthesizer.close()
            synthesizer = null
          },
          function (err) {
            console.trace('err - ' + err)
            synthesizer.close()
            synthesizer = null
          }
        )
        // this.audioUrl = audioFile
        console.log('audio~~', audioFile)
      } catch (error) {
        console.log('audio error ~~', error)
      }
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
  .content-text {
    box-sizing: border-box;
    padding: 0 30rpx;
    white-space: pre-wrap;
  }
  .audio-icon {
    font-size: 100rpx;
    right: 0;
    bottom: 80rpx;
  }
}
</style>
