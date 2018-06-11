import { Observable } from 'rxjs';
import { merge } from 'rxjs';
import { Injectable } from '@angular/core';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { map } from 'rxjs/operators';
export type Iwe7ShareConfig = {
    title: string;
    link: string;
    imgUrl: string;
    desc: string;
    type?: string;
    dataUrl?: string;
};
@Injectable()
export class Iwe7JssdkShareService {
    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }

    share(cfg: Iwe7ShareConfig): Observable<string> {
        return merge(
            this.iwe7Jssdk.onMenuShareAppMessage(cfg).pipe(
                map(res => 'app')
            ),
            this.iwe7Jssdk.onMenuShareQQ(cfg).pipe(
                map(res => 'qq')
            ),
            this.iwe7Jssdk.onMenuShareQZone(cfg).pipe(
                map(res => 'qzone')
            ),
            this.iwe7Jssdk.onMenuShareTimeline(cfg).pipe(
                map(res => 'timeline')
            ),
            this.iwe7Jssdk.onMenuShareWeibo(cfg).pipe(
                map(res => 'weibo')
            ),
        );
    }
}
