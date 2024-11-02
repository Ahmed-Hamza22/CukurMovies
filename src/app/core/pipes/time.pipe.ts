import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true
})
export class TimePipe implements PipeTransform {
  transform(time:number): string {
    let movieScreen = '';
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    if(time < 60){
      movieScreen = `${minutes}m`
    }else if(time > 60){
      movieScreen = `${hours}h ${minutes}m`
    }else if(time%60 == 0){
      movieScreen = `${hours}h`
    }
    return movieScreen;
  }
}
