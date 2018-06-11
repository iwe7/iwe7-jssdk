import { Observable, merge, timer } from 'rxjs';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { Injectable, isDevMode } from '@angular/core';
import { takeUntil, switchMap, take, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class Iwe7JssdkRecordService {
    dev: boolean = isDevMode();
    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }
    // 开始录音
    start(): Observable<string> {
        if (this.dev) {
            setTimeout(() => {
                this.iwe7Jssdk.setCyc('stopRecord', true);
            }, 5000);
        }
        setTimeout(() => {
            this.iwe7Jssdk.getCyc('startRecord', true);
        }, 0);
        return this.iwe7Jssdk.startRecord().pipe(
            tap(res => console.log('startRecord', res)),
            switchMap(res => {
                return merge(
                    // 当录音结束时
                    this.iwe7Jssdk.onVoiceRecordEnd(),
                    // 当停止录音时
                    this.iwe7Jssdk.getCyc('stopRecord')
                ).pipe(
                    take(1)
                );
            })
        );
    }
    // 开始录音，录音结束时上传
    startAndUpload(): Observable<string> {
        if (this.dev) {
            setTimeout(() => {
                this.iwe7Jssdk.setCyc('uploadVoice', 'serviceId');
            }, 500);
        }
        return this.start().pipe(
            switchMap(localId =>
                this.iwe7Jssdk.uploadVoice(localId)
            )
        );
    }
    upload(localId: string): Observable<string> {
        if (this.dev) {
            setTimeout(() => {
                // 开发者模式下，延迟2秒返回serveId
                this.iwe7Jssdk.setCyc('uploadVoice', 'serveId');
            }, 2000);
        }
        return this.iwe7Jssdk.uploadVoice(localId);
    }
    // 停止录音
    stop(): void {
        if (this.dev) {
            setTimeout(() => {
                this.iwe7Jssdk.setCyc('stopRecord', 'localId');
            }, 0);
        }
        this.iwe7Jssdk.stopRecord().subscribe();
    }
}
