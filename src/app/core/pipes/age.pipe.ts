import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  transform(birthDate: string, deathDate?: string): string {
    const birth = new Date(birthDate);
    const today = deathDate ? new Date(deathDate) : new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return deathDate ? `${age} years old` : `${age} years old`;
  }
}









