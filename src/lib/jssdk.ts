import { OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { InjectionToken } from '@angular/core';
export interface JssdkConfig {
    debug: boolean;
    appId: string;
    timestamp: string;
    nonceStr: string;
    signature: string;
    jsApiList: string[];
}
export const JssdkConfigToken = new InjectionToken<JssdkConfig>('JssdkConfigToken', {
    providedIn: 'root',
    factory: () => {
        return {
            debug: false,
            appId: '',
            timestamp: '',
            nonceStr: '',
            signature: '',
            jsApiList: []
        };
    }
});
declare const wx: any;
export abstract class Jssdk extends BehaviorSubject<boolean> implements OnDestroy {
    map: Map<string, Subject<any>> = new Map();
    constructor(private cfg: any) {
        super(false);
    }

    getCyc(name: string, isSubject: boolean = true): Observable<any> {
        if (!this.map.has(name)) {
            this.create(name, isSubject);
        }
        return this.map.get(name).pipe(
            takeUntil(this.pipe(
                filter(res => !!res)
            ))
        );
    }

    ngOnDestroy() {
        this.complete();
        this.map.forEach(item => item.complete());
    }

    setCyc(name: string, value: any, isSubject: boolean = true) {
        if (!this.map.has(name)) {
            this.create(name, isSubject);
        }
        this.map.get(name).next(value);
    }

    private create(name: string, isSubject: boolean = true): void {
        if (isSubject) {
            this.map.set(name, new Subject());
        } else {
            this.map.set(name, new BehaviorSubject(false));
        }
    }
    config(e: JssdkConfig): void {
        return wx.config(e);
    }
    ready(): void {
        wx.ready((res: any) => {
            this.next(true);
        });
    }
    error(e: any): void {
        this.complete();
    }
    load(): void {
        this.config(this.cfg);
        this.ready();
    }
    checkJsApi(e: string[]): Observable<any> {
        wx.checkJsApi({
            jsApiList: e,
            success: (res) => {
                this.setCyc('checkJsApi', res);
            }
        });
        return this.getCyc('checkJsApi');
    }
    onMenuShareTimeline(e: any): Observable<boolean> {
        wx.onMenuShareTimeline({
            ...e,
            success: () => {
                this.setCyc('onMenuShareTimeline', true);
            },
            cancel: () => {
                this.setCyc('onMenuShareTimeline', false);
            }
        });
        return this.getCyc('onMenuShareTimeline');
    }
    onMenuShareAppMessage(e: any): Observable<boolean> {
        wx.onMenuShareAppMessage({
            ...e,
            success: () => {
                this.setCyc('onMenuShareTimeline', true);
            },
            cancel: () => {
                this.setCyc('onMenuShareTimeline', false);
            }
        });
        return this.getCyc('onMenuShareTimeline');
    }
    onMenuShareQQ(e: any): Observable<boolean> {
        wx.onMenuShareQQ({
            ...e,
            success: () => {
                this.setCyc('onMenuShareTimeline', true);
            },
            cancel: () => {
                this.setCyc('onMenuShareTimeline', false);
            }
        });
        return this.getCyc('onMenuShareTimeline');
    }
    onMenuShareWeibo(e: any): Observable<boolean> {
        wx.onMenuShareWeibo({
            ...e,
            success: () => {
                this.setCyc('onMenuShareTimeline', true);
            },
            cancel: () => {
                this.setCyc('onMenuShareTimeline', false);
            }
        });
        return this.getCyc('onMenuShareTimeline');
    }
    onMenuShareQZone(e: any): Observable<boolean> {
        wx.onMenuShareQZone({
            ...e,
            success: () => {
                this.setCyc('onMenuShareTimeline', true);
            },
            cancel: () => {
                this.setCyc('onMenuShareTimeline', false);
            }
        });
        return this.getCyc('onMenuShareTimeline');
    }
    startRecord(): Observable<boolean> {
        wx.startRecord();
        this.setCyc('startRecord', true);
        return this.getCyc('startRecord');
    }
    stopRecord(): Observable<string> {
        wx.stopRecord({
            success: (res) => {
                this.setCyc('stopRecord', res.localId);
            }
        });
        return this.getCyc('stopRecord');
    }
    onVoiceRecordEnd(): Observable<string> {
        wx.onVoiceRecordEnd({
            complete: (res) => {
                this.setCyc('onVoiceRecordEnd', res.localId);
            }
        });
        return this.getCyc('onVoiceRecordEnd');
    }
    playVoice(e: string): Observable<boolean> {
        wx.playVoice({
            localId: e
        });
        this.setCyc('playVoice', true);
        return this.getCyc('playVoice');
    }
    pauseVoice(e: string): Observable<boolean> {
        wx.pauseVoice({
            localId: e
        });
        this.setCyc('pauseVoice', true);
        return this.getCyc('pauseVoice');
    }
    stopVoice(e: string): Observable<boolean> {
        wx.stopVoice({
            localId: e
        });
        this.setCyc('stopVoice', true);
        return this.getCyc('stopVoice');
    }
    onVoicePlayEnd(): Observable<any> {
        wx.onVoicePlayEnd({
            success: (res) => {
                this.setCyc('onVoicePlayEnd', res);
            }
        });
        return this.getCyc('onVoicePlayEnd');
    }
    uploadVoice(e: any): Observable<any> {
        wx.uploadVoice({
            ...e,
            success: (res) => {
                this.setCyc('uploadVoice', res);
            }
        });
        return this.getCyc('uploadVoice');
    }
    downloadVoice(e: any): Observable<string> {
        wx.downloadVoice({
            ...e,
            success: (res) => {
                this.setCyc('downloadVoice', res.localId);
            }
        });
        return this.getCyc('downloadVoice');
    }
    translateVoice(e: any): Observable<any> {
        wx.translateVoice({
            ...e,
            success: (res) => {
                this.setCyc('translateVoice', res);
            }
        });
        return this.getCyc('translateVoice');
    }
    chooseImage(e: any): Observable<string[]> {
        wx.chooseImage({
            ...e,
            success: (res) => {
                this.setCyc('chooseImage', res.localIds);
            }
        });
        return this.getCyc('chooseImage');
    }
    getLocation(e: any): Observable<any> {
        wx.getLocation({
            ...e,
            success: (res) => {
                this.setCyc('getLocation', res);
            }
        });
        return this.getCyc('getLocation');
    }
    previewImage(e: any): Observable<boolean> {
        wx.previewImage({
            ...e
        });
        this.setCyc('previewImage', true);
        return this.getCyc('previewImage');
    }
    uploadImage(e: any): Observable<string> {
        wx.uploadImage({
            ...e,
            success: (res) => {
                this.setCyc('uploadImage', res.serverId);
            }
        });
        return this.getCyc('uploadImage');
    }
    downloadImage(e: any): Observable<any> {
        wx.downloadImage({
            ...e,
            success: (res) => {
                this.setCyc('downloadImage', res);
            }
        });
        return this.getCyc('downloadImage');
    }
    getLocalImgData(e: string): Observable<any> {
        wx.getLocalImgData({
            localId: e,
            success: (res) => {
                this.setCyc('getLocalImgData', res);
            }
        });
        return this.getCyc('getLocalImgData');
    }
    getNetworkType(): Observable<any> {
        wx.getNetworkType({
            success: (res) => {
                this.setCyc('getNetworkType', res);
            }
        });
        return this.getCyc('getNetworkType');
    }
    openLocation(e: any): Observable<boolean> {
        wx.openLocation({
            ...e
        });
        this.setCyc('openLocation', true);
        return this.getCyc('openLocation');
    }
    hideOptionMenu(e: any): Observable<boolean> {
        wx.hideOptionMenu(e);
        this.setCyc('closeWindow', true);
        return this.getCyc('closeWindow');
    }
    showOptionMenu(e: any): Observable<boolean> {
        wx.showOptionMenu(e);
        this.setCyc('showOptionMenu', true);
        return this.getCyc('showOptionMenu');
    }
    closeWindow(e: any): Observable<boolean> {
        wx.closeWindow();
        this.setCyc('closeWindow', true);
        return this.getCyc('closeWindow');
    }
    hideMenuItems(e: any): Observable<boolean> {
        wx.hideMenuItems({
            menuList: e
        });
        this.setCyc('hideMenuItems', true);
        return this.getCyc('hideMenuItems');
    }
    showMenuItems(e: any): Observable<boolean> {
        wx.showMenuItems({
            menuList: e
        });
        this.setCyc('showMenuItems', true);
        return this.getCyc('showMenuItems');
    }
    hideAllNonBaseMenuItem(): Observable<boolean> {
        wx.hideAllNonBaseMenuItem();
        this.setCyc('hideAllNonBaseMenuItem', true);
        return this.getCyc('hideAllNonBaseMenuItem');
    }
    showAllNonBaseMenuItem(): Observable<boolean> {
        wx.showAllNonBaseMenuItem();
        this.setCyc('showAllNonBaseMenuItem', true);
        return this.getCyc('showAllNonBaseMenuItem');
    }
    scanQRCode(e: any): Observable<any> {
        wx.scanQRCode({
            ...e,
            success: (res) => {
                this.setCyc('scanQRCode', true);
            }
        });
        return this.getCyc('scanQRCode');
    }
    openAddress(): Observable<any> {
        wx.openAddress({
            success: (res) => {
                this.setCyc('openAddress', res);
            }
        });
        return this.getCyc('openAddress');
    }
    openProductSpecificView(e: any): Observable<boolean> {
        wx.openProductSpecificView(e);
        this.setCyc('openProductSpecificView', true);
        return this.getCyc('openProductSpecificView');
    }
    addCard(e: any): Observable<any> {
        wx.addCard({
            ...e,
            success: (res) => {
                this.setCyc('addCard', res);
            }
        });
        return this.getCyc('addCard');
    }
    chooseCard(e: any): Observable<any> {
        wx.chooseCard({
            ...e,
            success: (res) => {
                this.setCyc('chooseCard', res);
            }
        });
        return this.getCyc('chooseCard');
    }
    openCard(cardList: any[]): Observable<boolean> {
        wx.chooseCard({
            cardList: cardList
        });
        this.setCyc('openCard', true);
        return this.getCyc('openCard');
    }
    chooseWXPay(e: any): Observable<any> {
        wx.chooseWXPay({
            ...e,
            success: (res) => {
                this.setCyc('chooseWXPay', true);
            }
        });
        return this.getCyc('chooseWXPay');
    }

    startSearchBeacons(e: any): Observable<any> {
        wx.startSearchBeacons({
            ...e,
            complete: (argv) => {
                this.setCyc('startSearchBeacons', argv);
            }
        });
        return this.getCyc('startSearchBeacons');
    }
    stopSearchBeacons(): Observable<any> {
        wx.stopSearchBeacons({
            complete: (argv) => {
                this.setCyc('stopSearchBeacons', argv);
            }
        });
        return this.getCyc('stopSearchBeacons');
    }
    onSearchBeacons(e: any): Observable<any> {
        wx.onSearchBeacons({
            complete: (argv) => {
                this.setCyc('onSearchBeacons', argv);
            }
        });
        return this.getCyc('onSearchBeacons');
    }
    openEnterpriseChat(e: any): void {
        wx.openEnterpriseChat();
    }
    consumeAndShareCard(e: any): void {
        wx.consumeAndShareCard();
    }
    openEnterpriseRedPacket(e: any): void {
        wx.openEnterpriseRedPacket();
    }
}
