import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { Injectable, isDevMode } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
declare const wx: any;
@Injectable({
    providedIn: 'root'
})
export class Iwe7JssdkRecordService {
    dev: boolean = isDevMode();

    isStop: boolean = false;
    localId: string;

    stop$: Subject<string> = new Subject();

    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }
    // 开始录音
    start(): Observable<string> {
        this.stop();
        return this.iwe7Jssdk.startRecord().pipe(
            switchMap(res => {
                this.isStop = false;
                // 如果录音结束
                return merge(
                    this.iwe7Jssdk.onVoiceRecordEnd(),
                    this.stop$
                );
            })
        );
    }
    // 开始录音，录音结束时上传
    startAndUpload(): Observable<string> {
        return this.start().pipe(
            switchMap(localId =>
                this.iwe7Jssdk.uploadVoice(localId)
            )
        );
    }
    upload(localId: string): Observable<string> {
        return this.iwe7Jssdk.uploadVoice(localId);
    }
    // 停止录音
    stop() {
        this.iwe7Jssdk.stopRecord().pipe(
            tap(localId => {
                this.stop$.next(localId);
            })
        ).subscribe();
    }
}
