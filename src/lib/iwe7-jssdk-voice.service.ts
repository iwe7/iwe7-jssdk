import { filter, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { merge, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Iwe7JssdkVoiceService {
    localId: string;

    stopVoice: Subject<string> = new Subject();
    pauseVoice: Subject<string> = new Subject();

    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }

    play(localId: string = this.localId): Observable<'end' | 'stop' | 'pause' | string> {
        this.localId = localId;
        return this.iwe7Jssdk.playVoice(localId).pipe(
            switchMap(res => {
                return merge(
                    // 当播放结束时
                    this.iwe7Jssdk.onVoicePlayEnd().pipe(filter(res => res === localId), map(res => 'end')),
                    // 停止播放
                    this.stopVoice.pipe(filter(res => res === localId), map(res => 'stop')),
                    // 暂停播放
                    this.pauseVoice.pipe(filter(res => res === localId), map(res => 'pause'))
                );
            }),
            take(1)
        );
    }
    // 停止播放
    stop(localId: string = this.localId) {
        this.stopVoice.next(localId);
        this.iwe7Jssdk.stopVoice(localId).subscribe();
    }
    // 暂停播放
    pause(localId: string = this.localId) {
        this.pauseVoice.next(localId);
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
