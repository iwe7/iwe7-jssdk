import { Observable, merge } from 'rxjs';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { Injectable } from '@angular/core';
import { takeUntil, switchMap, take, tap } from 'rxjs/operators';

@Injectable()
export class Iwe7JssdkRecordService {

    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }
    // 开始录音
    start(): Observable<string> {
        return this.iwe7Jssdk.startRecord().pipe(
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
    // 停止录音
    stop(): void {
        this.iwe7Jssdk.stopRecord().subscribe();
    }
}
