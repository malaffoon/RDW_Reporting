"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var SearchPipe = (function () {
    function SearchPipe() {
    }
    SearchPipe.prototype.transform = function (items, search, on) {
        search = search || '';
        var searchCharacters = search.toLowerCase().split('').filter(function (character) { return !/\s/.test(character); });
        return items.filter(function (item) {
            var itemText = '';
            if (on == null) {
                itemText = item;
            }
            else if (on instanceof Array) {
                itemText = on.reduce(function (text, property) { return text + item[property]; }, '');
            }
            else if (on instanceof Function) {
                itemText = on(item);
            }
            else if (typeof on === 'string') {
                itemText = item[on];
            }
            itemText = itemText.toLowerCase();
            var previousIndex = -1;
            for (var i = 0; i < searchCharacters.length; i++) {
                var searchCharacter = searchCharacters[i];
                var index = itemText.indexOf(searchCharacter, previousIndex);
                if (index == -1) {
                    return false;
                }
                previousIndex = index;
            }
            return true;
        });
    };
    SearchPipe = __decorate([
        core_1.Pipe({
            name: 'search',
            pure: true
        })
    ], SearchPipe);
    return SearchPipe;
}());
exports.SearchPipe = SearchPipe;
