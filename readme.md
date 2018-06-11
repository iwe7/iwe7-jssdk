### jssdk rxjs 封装 Iwe7JssdkService
| 方法             | 说明                                   |
|----------------|--------------------------------------|
| load           | 加载cdn上得jssdk并初始化                     |
| loadObservable | 加载cdn上得jssd,远程获取jssdk初始化配置，并初始化jssdk |


### Iwe7JssdkRecordService 录音封装
| 方法              | 说明                         |
|-----------------|----------------------------|
| record          | 开始录音，监听录音完成或停止录音，返回localId |
| startWithUpload | 开始录音，录音结束时上传,放回serverId    |
| upload          | 上传本地录音到微信服务器，返回serverId      |
| stop            | 停止录音                       |

### Iwe7JssdkVoiceService 播放语音封装
| 方法         | 说明                                              |
|------------|-------------------------------------------------|
| play       | 播放，当播放完成时返回`end`，当暂停时放回`pause`,当停止播放时`stop`     |
| playServer | 播放远程资源,当播放完成时返回`end`，当暂停时放回`pause`,当停止播放时`stop` |
| stop       | 停止                                              |
| pause      | 暂停                                              |
