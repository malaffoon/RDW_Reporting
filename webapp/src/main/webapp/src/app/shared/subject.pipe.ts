import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'subject'})
export class SubjectPipe implements PipeTransform {
  private subjects = ["MATH, ELA", "MATH", "ELA"];

  transform(value: number): string {
    let result = "";

    if(value >= 0 && value < this.subjects.length)
      return this.subjects[value];

    return result;
  }
}
