import { merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { Injectable } from '@angular/core';

@Injectable()
export class Iwe7JssdkVoiceService {

    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }

    play(localId: string) {
        return this.iwe7Jssdk.playVoice(localId).pipe(
            switchMap(res => {
                return merge(
                    this.iwe7Jssdk.stopVoice()
                );
            })
        );
    }
}
