import { Observable, merge } from 'rxjs';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { Injectable } from '@angular/core';
import { takeUntil, switchMap, take } from 'rxjs/operators';

@Injectable()
export class Iwe7JssdkRecordService {

    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }
    // 录音封装
    record(): Observable<string> {
        return this.iwe7Jssdk.startRecord().pipe(
            switchMap(res => {
                return merge(
                    this.iwe7Jssdk.onVoiceRecordEnd(),
                    this.iwe7Jssdk.stopRecord()
                ).pipe(
                    take(1)
                );
            })
        );
    }
}
