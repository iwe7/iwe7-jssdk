import { takeLast } from 'rxjs/operators';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { Iwe7JssdkService } from './iwe7-jssdk.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Iwe7JssdkImageService {
    constructor(
        public iwe7Jssdk: Iwe7JssdkService
    ) { }

    choose(count: number): Observable<string[]> {
        return this.iwe7Jssdk.chooseImage({
            count: count
        });
    }

    chooseAndUpload(count: number) {
        return this.iwe7Jssdk.chooseImage({
            count: count
        }).pipe(
            switchMap((localIds: string[]) => {
                const serverIds: { localId: string, serverId: string, base64: string }[] = [];
                return from(localIds).pipe(
                    switchMap(localId => {
                        return this.iwe7Jssdk.getLocalImgData(localId).pipe(
                            switchMap(base64 => {
                                return this.iwe7Jssdk.uploadImage({
                                    localId: localId
                                }).pipe(
                                    tap(serverId => serverIds.push({
                                        localId: localId,
                                        serverId: serverId,
                                        base64: base64
                                    }))
                                );
                            })
                        );
                    }),
                    takeLast(1),
                    map(res => serverIds)
                );
            }),
        );
    }

    preview(current: string, urls?: string[]): void {
        this.iwe7Jssdk.previewImage({
            current: current,
            urls: urls ? urls : []
        }).subscribe();
    }
}
