// makeEnglish.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'makeEnglish'})
export class MakeEnglish implements PipeTransform {
  transform(value: string, args: string[]): any {
    if (!value) return value;

    let v = value.replace(/_/g, " ");
    
    return v.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
