import { merge, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { Injectable } from '@angular/core';

@Injectable()
export class Iwe7JssdkVoiceService {
    localId: string;
    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }

    play(localId: string = this.localId): Observable<'end' | 'stop' | 'pause' | string> {
        this.localId = localId;
        return this.iwe7Jssdk.playVoice(localId).pipe(
            switchMap(res => {
                return merge(
                    // 当播放结束时
                    this.iwe7Jssdk.onVoicePlayEnd().pipe(map(res => 'end')),
                    // 停止播放
                    this.iwe7Jssdk.getCyc('stopVoice').pipe(map(res => 'stop')),
                    // 暂停播放
                    this.iwe7Jssdk.getCyc('pauseVoice').pipe(map(res => 'pause'))
                );
            })
        );
    }
    // 停止播放
    stop(localId: string = this.localId) {
        this.iwe7Jssdk.stopVoice(localId).subscribe();
    }
    // 暂停播放
    pause(localId: string = this.localId) {
        this.iwe7Jssdk.pauseVoice(localId).subscribe();
    }

    playServer(serverId: string) {
        return this.iwe7Jssdk.downloadVoice({
            serverId: serverId,
            isShowProgressTips: 0,
        }).pipe(
            switchMap(localId => {
                return this.play(localId);
            })
        );
    }

}
