import {Component, OnInit, ElementRef, ViewChild, AfterViewChecked} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {TranslateService} from "ng2-translate";
import {init} from "protractor/built/launcher";
import {Observable, AjaxResponse} from "rxjs";

@Component({
  selector: 'student-exam-items',
  templateUrl: './student-exam-items.component.html'
})
export class StudentExamItemsComponent implements OnInit, AfterViewChecked {

  private breadcrumbs = [];
  private group: any;
  private student: any;
  private exam: any;
  private items = [];
  private size = 1;

  @ViewChild('irisframe')
  irisFrame: ElementRef;

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService) {
  }

  ngAfterViewChecked() {
    // this.callIris();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getStudentExam(params['groupId'], params['studentId'], params['examId']).subscribe((data:any) => {
        this.translate.get('labels.assessment.grade').subscribe(breadcrumbName => {
          let group = data.group;
          let student = data.student;
          let exam = data.exam;
          let items = data.items;
          this.breadcrumbs = [
            {name: group.name, path: `/groups/${group.id}/students`},
            {
              name: `${student.lastName}, ${student.firstName}`,
              path: `/groups/${group.id}/students/${student.id}/exams`
            },
            {name: `${breadcrumbName} ${exam.assessment.grade} ${exam.assessment.name}`}
          ];
          this.group = group;
          this.student = student;
          this.exam = exam;
          this.items = items;
        })
      })
    });
  }
  //
  // callIris() {
  //
  //   let IRiS = this.initIris();
  //
  //   IRiS.setFrame(this.irisFrame.nativeElement);
  //
  //   // set the vendor guid.
  //   //Note: in the OSS IRiS case we do not care for this.
  //   let vendorId = '2B3C34BF-064C-462A-93EA-41E9E3EB8333';
  //   let token = {"passage":{"autoLoad":"false"},"items":[{"response":"<p>alla</p>","id":"I-187-2700"}]};
  //
  //     IRiS.loadToken(vendorId, token);
  // }
  //
  // initIris() {
  //
  //   var util = this.initWindow();
  //   var IRiS = (function (XDM: any) {
  //
  //     XDM.init(window);
  //
  //     XDM.addListener('IRiS:ready', function () {
  //       if (typeof api.onready === 'function') {
  //         api.onready();
  //       }
  //     });
  //
  //     XDM.addListener('IRiS:navUpdate', function (havePrev, haveNext) {
  //       if (typeof api.onnavUpdate === 'function') {
  //         api.onnavUpdate(havePrev, haveNext);
  //       }
  //     });
  //
  //     var frame = null;
  //     var api = new IrisClient();
  //
  //     api.setFrame = function (frameWindow) {
  //       if (!frameWindow.postMessage) {
  //         frameWindow = frameWindow.contentWindow || frameWindow;
  //       }
  //
  //       frame = frameWindow;
  //     };
  //     //
  //     // api.loadToken = function (vendorId, token) {
  //     //   return XDM(frame).post('IRiS:loadToken', vendorId, token);
  //     // };
  //
  //     api.loadToken = function (vendorId, token) {
  //
  //
  //       // this.id = ++id;
  //
  //
  //       // requests[id] = this;
  //
  //       function Request(name) {
  //         this.name = name;
  //         this.data = [].slice.call(arguments);
  //         this.type = 'request';
  //       }
  //
  //       Request.prototype.send = function() {
  //         let message = JSON.stringify(this);
  //         this.targetWindow = this.targetWindow || window;
  //         this.targetOrigin = this.targetOrigin || '*';
  //
  //         this.targetWindow.postMessage(message, this.targetOrigin);
  //       };
  //
  //
  //       var req = new Request('IRiS:loadToken');
  //       // req.targetWindow = this.targetWindow || window;
  //       // req.targetOrigin = this.targetOrigin || '*';
  //       req.data = [].slice.call(arguments, 1);
  //       req.send();
  //       return req;
  //     };
  //
  //     api.loadContent = function (vendorId, token) {
  //       return XDM(frame).post('IRiS:loadContent', vendorId, token);
  //     };
  //
  //     api.setResponse = function (value) {
  //       return XDM(frame).post('IRiS:setResponse', value);
  //     };
  //
  //     api.setResponses = function (itemResponses) {
  //       return XDM(frame).post('IRiS:setResponses', itemResponses);
  //     };
  //
  //     api.getResponse = function () {
  //       return XDM(frame).post('IRiS:getResponse');
  //     };
  //
  //     api.showNext = function () {
  //       return XDM(frame).post('IRiS:showNext');
  //     };
  //
  //     api.showPrev = function () {
  //       return XDM(frame).post('IRiS:showPrev');
  //     };
  //
  //     api.onready = null;
  //     api.onnavUpdate = null;
  //
  //     // expose api
  //     return api;
  //
  //   })(util.XDM);
  //   return IRiS;
  // }
  //
  // initWindow(){
  //
  //   /*
  //    Cross-domain messaging API.
  //    - Requires jQuery
  //    - Supports promises
  //    - Return objects from handlers
  //    - Serializes error messages
  //
  //    Inspiration:
  //    - http://engineering.wingify.com/posts/jquery-promises-with-postmessage/
  //    - https://github.com/wingify/please.js
  //
  //    Example:
  //
  //    XDM.init(window); // <-- window to listen on (call this on parent and frame)
  //
  //    // register handler in frame
  //    XDM.addListener('TDS:setResponse', function(itemKey, value) {
  //    return { key: + new Date() };
  //    });
  //
  //    // post to frame in parent
  //    XDM(frame).post('TDS:setResponse', 100, 'A')
  //    .then(function(obj) {
  //    console.log('setResponse data: ', obj.key);
  //    }, function(ex) {
  //    console.log('setResponse error: ', ex);
  //    });
  //
  //    */
  //   var Util : any = {};
  //
  //   Util.XDM = (function ($) {
  //
  //     var defaults = {
  //       targetWindow: window,
  //       targetOrigin: '*',
  //       sourceOrigin: false
  //     };
  //
  //     var id = 0;
  //     var requests = {};
  //     var listeners = {};
  //
  //     var XDM :any = function (targetWindow, targetOrigin) {
  //       targetWindow = targetWindow || window;
  //       // return $.extend(XDM.bind(), {
  //       //   targetWindow: targetWindow,
  //       //   targetOrigin: targetOrigin,
  //       // });
  //     };
  //
  //     XDM.useJQuery = function (jQuery) {
  //       $ = jQuery;
  //     };
  //
  //     XDM.serialize = function (value) {
  //       return JSON.stringify(value);
  //     };
  //
  //     XDM.deserialize = function (value) {
  //       return JSON.parse(value);
  //     };
  //
  //     XDM.suppressException = false;
  //
  //     XDM.init = function (thisWindow) {
  //       thisWindow = thisWindow || window;
  //       if (thisWindow.addEventListener) {
  //         thisWindow.addEventListener('message', messageHandler, true);
  //       }
  //       return XDM;
  //     };
  //
  //     // register a listener
  //     XDM.addListener = function(name, callback) {
  //       listeners[name] = callback;
  //     };
  //
  //     // remove a listener
  //     XDM.removeListener = function (name) {
  //       delete listeners[name];
  //     };
  //
  //     // clear all listeners
  //     XDM.removeListeners = function () {
  //       Object.keys(listeners).forEach(function(key) {
  //         XDM.removeListener(key);
  //       });
  //     };
  //
  //     // send a request
  //     XDM.post = function(requestName) {
  //       var req = new Request(requestName);
  //       req.targetWindow = this.targetWindow || defaults.targetWindow;
  //       req.targetOrigin = this.targetOrigin || defaults.targetOrigin;
  //       req.data = [].slice.call(arguments, 1);
  //       req.send();
  //       return req;
  //     }
  //
  //     // recieve a request/response
  //     function messageHandler(evt) {
  //
  //       // console.log('MESSAGE RECIEVED', evt);
  //
  //       try {
  //         var data = XDM.deserialize(evt.data);
  //       } catch (ex) {
  //         console.log('XDM: error parsing json data');
  //         return;
  //       }
  //
  //       if (data.type === 'request') {
  //         // message request on the server from the client
  //         console.log('MESSAGE REQUEST: ', data);
  //         var response = new Response(data);
  //         response.targetWindow = evt.source;
  //         response.targetOrigin = evt.origin === 'null' ? defaults.targetOrigin : evt.origin;
  //         response.send();
  //       }
  //       else if (data.type === 'response') {
  //         // message response from the server to the client
  //         console.log('MESSAGE RESPONSE: ', data);
  //         if (data.success) {
  //           requests[data.id].resolve(data.data);
  //         } else {
  //           requests[data.id].reject(new XDM.Error(data.data));
  //         }
  //
  //         delete requests[data.id];
  //       }
  //     }
  //
  //     function Request(name) {
  //       this.init.apply(this, [].slice.call(arguments));
  //     }
  //
  //     Request.prototype.init = function(name) {
  //
  //       $.extend(this, $.Deferred());
  //
  //       this.id = ++id;
  //       this.name = name;
  //       this.data = [].slice.call(arguments);
  //       this.type = 'request';
  //
  //       requests[id] = this;
  //     };
  //
  //     Request.prototype.send = function() {
  //       this.targetWindow = this.targetWindow || defaults.targetWindow;
  //       this.targetOrigin = this.targetOrigin || defaults.targetOrigin;
  //       this.targetWindow.postMessage(XDM.serialize(this), this.targetOrigin);
  //     };
  //
  //     Request.prototype.toJSON = function() {
  //       return {
  //         id: this.id,
  //         name: this.name,
  //         type: this.type,
  //         data: this.data
  //       };
  //     };
  //
  //     // Request.create = function (obj) {
  //     //   return $.extend(new Request(), obj);
  //     // };
  //
  //     function Response(req) {
  //       this.init(req);
  //     }
  //
  //     Response.prototype.init = function(req) {
  //       this.id = req.id;
  //       this.name = req.name;
  //       this.type = 'response';
  //       try {
  //         // parse the request data
  //         // var request = $.extend(this.init.apply(this, [].slice.call(arguments)), req);
  //         var request = req;
  //
  //         // lookup the listener for this type of request
  //         var listener = listeners[req.name];
  //
  //         // if there is a listener found the run it
  //         if (listener) {
  //           this.data = listener.apply(this, request.data);
  //           this.success = true;
  //         } else {
  //           throw new Error('Could not find the listener \'' + req.name + '\'');
  //         }
  //       } catch (error) {
  //         // listener threw an exception
  //         this.data = new XDM.Error(error);
  //         this.success = false;
  //       }
  //     };
  //
  //     Response.prototype.send = function () {
  //
  //       // set defaults
  //       this.targetWindow = this.targetWindow || defaults.targetWindow;
  //       this.targetOrigin = this.targetOrigin || defaults.targetOrigin;
  //
  //       var request = this;
  //       function postMessage(value) {
  //         request.data = value;
  //         request.targetWindow.postMessage(XDM.serialize(request), request.targetOrigin);
  //       };
  //
  //       postMessage(this.data);
  //
  //       // delay posting message in case listener returned a promise
  //       // $.when(this.data).then(function (value) {
  //       //   postMessage(value);
  //       // }, function(error) {
  //       //   request.success = false;
  //       //   if (error instanceof Error) {
  //       //     error = new XDM.Error(error);
  //       //   }
  //       //   postMessage(error);
  //       // });
  //
  //       // throw exception
  //       if (!XDM.suppressException && !this.success) {
  //         throw this.data.error;
  //       }
  //     };
  //
  //     Response.prototype.toJSON = function() {
  //       return {
  //         id: this.id,
  //         name: this.name,
  //         type: this.type,
  //         data: this.data,
  //         success: this.success
  //       };
  //     };
  //
  //     XDM.Error = function (error) {
  //       console.log(error);
  //       // this.error = error;
  //       // $.extend(this, error);
  //       // this.name = error.name;
  //       // this.message = error.message;
  //       //
  //       // // IE
  //       // this.number = error.number;
  //       // this.description = error.description;
  //       //
  //       // // Firefox
  //       // this.fileName = error.fileName;
  //       // this.lineNumber = error.lineNumber;
  //       //
  //       // // Chrome / Firefox / latest IE
  //       // this.stack = error.stack;
  //       //
  //       // this.toString = function () {
  //       //   return this.message;
  //       // };
  //
  //     };
  //
  //     return XDM;
  //
  //   })((<any>window).$);
  //
  //   return Util;
  //
  // }

  private toggleWindowSize() {
    this.size++;
    if (this.size > 2) {
      this.size = 0;
    }
    console.log('size', this.size);
  }
}

export class IrisClient {
  setFrame: (frameWindow) => any;
  loadToken: (vendorId, token) => Observable<AjaxResponse>;
  loadContent: (vendorId, token) => Observable<AjaxResponse>;
  setResponse: (vendorId, token) => Observable<AjaxResponse>;
  setResponses: (vendorId, token) => Observable<AjaxResponse>;
  getResponse: (vendorId, token) => Observable<AjaxResponse>;
  showNext: (vendorId, token) => Observable<AjaxResponse>;
  showPrev: (vendorId, token) => Observable<AjaxResponse>;
  onready: () => any;
  onnavUpdate: (havePrev, haveNext) => any;
}


