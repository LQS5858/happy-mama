//单例设计模式
import { eventSourceTime } from '@/config'
import { isEmpty } from 'lodash'
class StreamSource {
  constructor(url) {
    this.url = url ? url : process.env.SOCKET_URL
    console.log('sourceUrl~~', url, this.url);
    this.intervalId = null
    this.socketStatus = null
    this.socketQueque = []
    this.callback = () => { }
    if (!StreamSource.instance) {
      StreamSource.instance = this
      return StreamSource.instance
    }
    return StreamSource.instance
  }
  subscribe (topic, callback) {
    let reg = /ok/gi
    let self = this
    this.callback = callback
    if (reg.test(this.socketStatus)) {
      try {
        uni.sendSocketMessage({
          data: topic,
          fail: function () {
            console.log('error~~send');
            self.socketQueque.push({ topic, callback })
          }
        });
      } catch (error) {
        console.log('error~~', error);
        this.socketQueque({ topic, callback })
      }
    } else {
      this.socketQueque.push({ topic, callback })
    }


  }
  reSubscribe () {
    try {
      console.log('resubscribe~~', isEmpty(this.socketQueque));
      if (isEmpty(this.socketQueque)) return
      while (this.socketQueque.length) {
        let { topic, callback } = this.socketQueque && this.socketQueque?.shift() || []
        this.subscribe(topic, callback)
      }
    } catch (error) {
      console.log(error);
    }


  }
  connect () {
    try {
      this.source = uni.connectSocket({
        url: this.url, success: res => {
          console.log('connect~~', res);
          try {
            this.socketStatus = res?.errMsg || ''
            this.intervalId = clearInterval(this.intervalId)
          } catch (error) {
            console.log('error~~', error);
          }

        },
        fail: error => {
          console.log('error~~', error);
          this.socketStatus = null
          this.intervalId = setInterval(() => {
            this.connect()
          }, eventSourceTime);
        }
      })
      uni.onSocketOpen((res) => {
        console.log('event source 连接成功,可以发送数据～～', res, res.header);
        this.socketStatus = 'ok'
        this.reSubscribe()
        this.onMessage()
      })

    } catch (error) {
      console.log(error);
    }
  }
  closeSocket () {
    uni.closeSocket({})
    this.socketStatus = null
  }
  onMessage () {
    if (!this.source) return
    uni.onSocketError(
      (event) => {
        console.log('error~~', event);
        this.socketStatus = null
        this.intervalId = setInterval(() => {
          this.connect()
        }, eventSourceTime);
      }
    )
    uni.onSocketMessage(data => {
      console.log('event message~~', data);
      let res = data?.data ? JSON.parse(data?.data) : data?.data
      this.callback && this.callback(res)
    })
    uni.onSocketClose(res => {
      console.log('socket close');
      this.socketStatus = null
      this.intervalId = setInterval(() => {
        this.connect()
      }, eventSourceTime);
    })
  }
}

export { StreamSource }