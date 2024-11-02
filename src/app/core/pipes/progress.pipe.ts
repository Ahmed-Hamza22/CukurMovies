import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progress',
  standalone: true
})
export class ProgressPipe implements PipeTransform {
  transform(num: number): number {
    return 100 - parseFloat(num.toString().slice(0, 3)) * 10;
  }
}
