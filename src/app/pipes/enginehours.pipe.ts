import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enginehours'
})

export class EnginehoursPipe implements PipeTransform {
  transform(value: any, ...args: any): any {
    console.log(value)
    var h = Math.floor(value / 3600);
    var m = Math.floor(value % 3600 / 60);
    var s = Math.floor(value % 3600 % 60);
    return h +":"+ m +":"+ s; 
  }
}
