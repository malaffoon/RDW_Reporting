import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], search: string): any[] {
    let searchCharacters = search.toLowerCase().split('').filter(character => !/\s/.test(character));
    return items.filter(item => {
      let itemText = item.toLowerCase();
      let previousIndex = -1;
      for (let i = 0; i < searchCharacters.length; i++) {
        let searchCharacter = searchCharacters[i];
        let index = itemText.indexOf(searchCharacter);
        if (index == -1 || index <= previousIndex) {
          return false;
        }
        previousIndex = index;
      }
      return true;
    });
  }
}
