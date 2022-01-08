import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare class Visualforce {
    static remoting: { Manager: { invokeAction: any } };
}

@Injectable({
    providedIn: 'root'
})

export class SalesforceService {
    public getSFResource = (path: string) => `${window['_VfResources']}${path}`;
    public getRNXTMethodName = () => `${window['_rnxtMethodName']}`;

    public remoteAction(methodName: string,
                        params: string[],
                        resolve,
                        reject,
                        config?: any) {
      // console.log('inside SalesforceService.remoteAction for ' + methodName);
      const self = this;
      var nsMethodName = this.getRNXTMethodName();
      //console.log('method name in lib = ' + nsMethodName);

      Visualforce.remoting.Manager.invokeAction(
        nsMethodName,
        //'NxtController.process',
        //`{!$RemoteAction.NxtController.process}`,
        ...params,
        function (result, event) {
          try {
            result = JSON.parse(result);
          } catch (error) {
            reject(error);
          }
          console.log('Function called was - ' + methodName);
          //console.log(result);
          //console.log(resolve(result));
          if (result.status) {
              resolve(result);
          } else {
              resolve(result);
          }
        },
        config || { buffer: false, escape: false }
      );
    }

    constructor(private _router: Router ,private route: ActivatedRoute) {

    }
}
