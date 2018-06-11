import { filter } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Iwe7ScriptService } from 'iwe7-script';
import { Injectable, Inject, Optional } from '@angular/core';
import { Jssdk, JssdkConfigToken, JssdkConfig } from './jssdk';
const jssdkUrl: string = 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js';
declare const wx: any;
@Injectable({
  providedIn: 'root'
})
export class Iwe7JssdkService extends Jssdk {
  constructor(
    @Inject(JssdkConfigToken)
    @Optional()
    _config: JssdkConfig,
    public script: Iwe7ScriptService,
    public http: HttpClient
  ) {
    super(_config);
  }

  setConfig(cfg: any) {
    this.cfg = cfg;
  }

  load() {
    if (!wx) {
      this.script.load([
        jssdkUrl
      ]).subscribe(res => {
        if (res) {
          super.load();
        }
      });
    } else {
      super.load();
    }
  }

  loadObservable(obs: Observable<JssdkConfig>) {
    if (!wx) {
      obs.subscribe(cfg => {
        this.config(cfg);
        this.ready();
      });
    } else {
      this.script.load([
        jssdkUrl
      ]).pipe(
        filter(res => !!res),
        switchMap(res => {
          return obs;
        })
      ).subscribe(cfg => {
        this.config(cfg);
        this.ready();
      });
    }
  }
}
