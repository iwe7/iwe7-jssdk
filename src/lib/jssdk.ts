import { OnDestroy, isDevMode } from '@angular/core';
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
    dev: boolean = isDevMode();
    constructor(public cfg: any) {
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
        if (this.dev) {
            this.next(true);
        } else {
            wx.ready((res: any) => {
                this.next(true);
            });
        }
    }
    error(): void {
        wx.error((res) => {
            console.log(res);
            if (this.dev) {
                // 开发模式下不报错
            } else {
                this.complete();
                this.ngOnDestroy();
            }
        });
    }
    load(): void {
        this.config(this.cfg);
        this.ready();
        this.error();
    }
    checkJsApi(e: string[]): Observable<any> {
        wx.checkJsApi({
            jsApiList: e,
            success: (res) => {
                this.setCyc('checkJsApi', res);
            },
            fail: (res) => {
                console.log(res);
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
            },
            fail: (res) => {
                console.log(res);
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
            },
            fail: (res) => {
                console.log(res);
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
            },
            fail: (res) => {
                console.log(res);
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
            },
            fail: (res) => {
                console.log(res);
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
            },
            fail: (res) => {
                console.log(res);
            }
        });
        return this.getCyc('onMenuShareTimeline');
    }
    startRecord(): Observable<boolean> {
        return Observable.create(obser => {
            wx.startRecord();
            obser.next(true);
            obser.complete();
        });
    }
    stopRecord(): Observable<string> {
        return Observable.create(obser => {
            wx.stopRecord({
                success: (res) => {
                    obser.next(res.localId);
                    obser.complete();
                },
                fail: (res) => {
                    if (this.dev) {
                        obser.next('localId');
                        obser.complete();
                    } else {
                        obser.error(res);
                    }
                }
            });
        });
    }
    onVoiceRecordEnd(): Observable<string> {
        return Observable.create(obser => {
            wx.onVoiceRecordEnd({
                complete: (res) => {
                    obser.next(res.localId);
                    obser.complete();
                },
                fail: (res: any) => {
                    if (this.dev) {
                        setTimeout(() => {
                            obser.next('localId');
                            obser.complete();
                        }, 5000);
                    } else {
                        obser.error(res);
                    }
                }
            });
        });
    }
    playVoice(e: string): Observable<string> {
        return Observable.create(obser => {
            wx.playVoice({
                localId: e
            });
            obser.next(e);
            obser.complete();
        });
    }
    pauseVoice(e: string): Observable<string> {
        return Observable.create(obser => {
            wx.pauseVoice({
                localId: e
            });
            obser.next(e);
            obser.complete();
        });
    }
    stopVoice(e: string): Observable<string> {
        return Observable.create(obser => {
            wx.stopVoice({
                localId: e
            });
            obser.next(e);
            obser.complete();
        });
    }
    onVoicePlayEnd(): Observable<string> {
        return Observable.create(obser => {
            wx.onVoicePlayEnd({
                success: (res) => {
                    obser.next(res.localId);
                    obser.complete();
                },
                fail: (err) => {
                    if (this.dev) {
                        setTimeout(() => {
                            obser.next('localId');
                            obser.complete();
                        }, 5000);
                    } else {
                        obser.error(err);
                    }
                }
            });
        });
    }
    uploadVoice(e: any): Observable<string> {
        return Observable.create(obser => {
            wx.uploadVoice({
                ...e,
                success: (res) => {
                    obser.next(res.serverId);
                    obser.complete();
                },
                fail: (res) => {
                    if (this.dev) {
                        obser.next('serverId');
                        obser.complete();
                    } else {
                        obser.error(res);
                    }
                }
            });
        });
    }
    downloadVoice(e: any): Observable<string> {
        return Observable.create(obser => {
            wx.downloadVoice({
                ...e,
                success: (res) => {
                    obser.next(res.localId);
                    obser.complete();
                },
                fail: (err) => {
                    if (this.dev) {
                        setTimeout(() => {
                            obser.next('localId');
                            obser.complete();
                        }, 200);
                    } else {
                        obser.error(err);
                    }
                }
            });
        });
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
        setTimeout(() => {
            this.setCyc('previewImage', true);
        }, 0);
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
    downloadImage(e: any): Observable<string> {
        wx.downloadImage({
            ...e,
            success: (res) => {
                this.setCyc('downloadImage', res.localId);
            }
        });
        return this.getCyc('downloadImage');
    }
    getLocalImgData(e: string): Observable<string> {
        wx.getLocalImgData({
            localId: e,
            success: (res) => {
                this.setCyc('getLocalImgData', res.localData);
            }
        });
        return this.getCyc('getLocalImgData');
    }
    getNetworkType(): Observable<string> {
        wx.getNetworkType({
            success: (res) => {
                this.setCyc('getNetworkType', res.networkType);
            }
        });
        return this.getCyc('getNetworkType');
    }
    openLocation(e: any): Observable<boolean> {
        wx.openLocation({
            ...e
        });
        setTimeout(() => {
            this.setCyc('openLocation', true);
        }, 0);
        return this.getCyc('openLocation');
    }
    hideOptionMenu(e: any): Observable<boolean> {
        wx.hideOptionMenu(e);
        setTimeout(() => {
            this.setCyc('closeWindow', true);
        }, 0);
        return this.getCyc('closeWindow');
    }
    showOptionMenu(e: any): Observable<boolean> {
        wx.showOptionMenu(e);
        setTimeout(() => {
            this.setCyc('showOptionMenu', true);
        }, 0);
        return this.getCyc('showOptionMenu');
    }
    closeWindow(e: any): Observable<boolean> {
        wx.closeWindow();
        setTimeout(() => {
            this.setCyc('closeWindow', true);
        }, 0);
        return this.getCyc('closeWindow');
    }
    hideMenuItems(e: any): Observable<boolean> {
        wx.hideMenuItems({
            menuList: e
        });
        setTimeout(() => {
            this.setCyc('hideMenuItems', true);
        }, 0);
        return this.getCyc('hideMenuItems');
    }
    showMenuItems(e: any): Observable<boolean> {
        wx.showMenuItems({
            menuList: e
        });
        setTimeout(() => {
            this.setCyc('showMenuItems', true);
        }, 0);
        return this.getCyc('showMenuItems');
    }
    hideAllNonBaseMenuItem(): Observable<boolean> {
        wx.hideAllNonBaseMenuItem();
        setTimeout(() => {
            this.setCyc('hideAllNonBaseMenuItem', true);
        }, 0);
        return this.getCyc('hideAllNonBaseMenuItem');
    }
    showAllNonBaseMenuItem(): Observable<boolean> {
        wx.showAllNonBaseMenuItem();
        setTimeout(() => {
            this.setCyc('showAllNonBaseMenuItem', true);
        }, 0);
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
        setTimeout(() => {
            this.setCyc('openProductSpecificView', true);
        }, 0);
        return this.getCyc('openProductSpecificView');
    }
    addCard(e: any): Observable<{ cardId: string, code: string }[]> {
        wx.addCard({
            ...e,
            success: (res) => {
                this.setCyc('addCard', res.cardList);
            }
        });
        return this.getCyc('addCard');
    }
    chooseCard(e: any): Observable<{ cardId: string, code: string }[]> {
        wx.chooseCard({
            ...e,
            success: (res) => {
                this.setCyc('chooseCard', res.cardList);
            }
        });
        return this.getCyc('chooseCard');
    }
    openCard(cardList: any[]): Observable<boolean> {
        wx.chooseCard({
            cardList: cardList
        });
        setTimeout(() => {
            this.setCyc('openCard', true);
        }, 0);
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
