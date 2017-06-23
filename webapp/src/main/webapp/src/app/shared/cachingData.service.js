"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var CachingDataService = (function () {
    function CachingDataService(http) {
        this.http = http;
        this.cache = {};
    }
    CachingDataService.prototype.get = function (url, options) {
        var _this = this;
        if (this.cache[url]) {
            return Rx_1.Observable.of(this.cache[url]);
        }
        var observable = this.http
            .get("/api" + url, options)
            .share()
            .map(function (response) { return response.json(); });
        observable
            .subscribe(function (x) {
            _this.cache[url] = x;
        });
        return observable;
    };
    CachingDataService = __decorate([
        core_1.Injectable()
    ], CachingDataService);
    return CachingDataService;
}());
exports.CachingDataService = CachingDataService;
