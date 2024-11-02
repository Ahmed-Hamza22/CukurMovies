import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../core/environment/environment';
import { DetailsService } from '../../core/services/details.service';
import { IPerson, IPersonExIds } from '../../core/interfaces/iperson';
import { IImage } from '../../core/interfaces/iimage';
import { DatePipe } from '@angular/common';
import { IPersonCastCredit, IPersonCrewCredit } from '../../core/interfaces/iperson-credit';
import { AgePipe } from '../../core/pipes/age.pipe';
import { TermPipe } from '../../core/pipes/term.pipe';
import { MoviesService } from '../../core/services/movies.service';
import { ShufflePipe } from '../../core/pipes/shuffle.pipe';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [DatePipe, AgePipe, TermPipe, RouterLink, ShufflePipe],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class PersonDetailsComponent implements OnInit {
  private readonly _MoviesService = inject(MoviesService);
  private readonly _TitleService = inject(Title);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  personID:any;
  imgPrefix:string = environment.imgPath;
  personDetails:IPerson = {} as IPerson;
  personFamousFor:string = '';
  PersonExternalIds:IPersonExIds = {} as IPersonExIds;
  PersonImages:IImage [] = [];
  personCombinedCastCredits:IPersonCastCredit[] | any = []; 
  personCombinedCrewCredits:IPersonCrewCredit[] = []; 
  knownCastCredits!:number;
  knownCrewCredits!:number;
  isExpanded:boolean = false;
  knownForCast: IPersonCastCredit [] = [];
  knownForCrew: IPersonCrewCredit [] = [];
  castCredits:any;
  repeatCastCredits:any;
  crewCredits:any;
  repeatCrewCredits:any;
  currentChoosen:string = 'All';
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.personID = params.get('id');
        this._DetailsService.getDetails('person',this.personID).subscribe({
          next:(res)=>{
            this.personDetails = res;
            this._TitleService.setTitle(this.personDetails.name + ' - ÇukurWatch');
            this.personFamousFor = res.known_for_department;
          }
        });
        this._DetailsService.getExternalIds('person',this.personID).subscribe({
          next:(res)=>{
            this.PersonExternalIds = res;
          }
        });
        this._DetailsService.getPersonCredits('combined',this.personID).subscribe({
          next:(res)=>{
            this.personCombinedCastCredits = res.cast;
            this.knownCastCredits = this.personCombinedCastCredits?.length -1;
            this.personCombinedCrewCredits = res.crew;
            this.personCombinedCastCredits.sort((a: any, b: any) => {
              const dateA = a.release_date && a.release_date.trim() !== "" ? new Date(a.release_date).getTime() : 
                            a.first_air_date && a.first_air_date.trim() !== "" ? new Date(a.first_air_date).getTime() : 
                            -Infinity;
              const dateB = b.release_date && b.release_date.trim() !== "" ? new Date(b.release_date).getTime() : 
                            b.first_air_date && b.first_air_date.trim() !== "" ? new Date(b.first_air_date).getTime() : 
                            -Infinity;
              if (dateA === -Infinity && dateB === -Infinity) return 0;
              if (dateA === -Infinity) return 1;
              if (dateB === -Infinity) return -1;
              return dateB - dateA;
            });
            const groupedByYear: { [year: string]: any[] } = {};
            this.personCombinedCastCredits.forEach((work: any) => {
              const year = work.release_date 
                ? new Date(work.release_date).getFullYear() 
                : work.first_air_date 
                ? new Date(work.first_air_date).getFullYear() 
                : 'Unknown';
              if (!groupedByYear[year]) {
                groupedByYear[year] = [];
              }
              const existingWork = groupedByYear[year].find((item: any) => item.id === work.id);
              if (existingWork) {
                existingWork.characters.push({
                  character: work.character,
                  episode_count: work.episode_count || 1
                });
              } else {
                groupedByYear[year].push({
                  id: work.id,
                  title: work.title || work.name,
                  media_type: work.media_type,
                  poster_path: work.poster_path,
                  release_date: work.release_date || work.first_air_date,
                  vote_average: work.vote_average,
                  vote_count: work.vote_count,
                  popularity: work.popularity,
                  characters: [{
                    character: work.character,
                    episode_count: work.episode_count || 1
                  }],
                  overview: work.overview,
                  backdrop_path: work.backdrop_path
                });
              }
            });
            const sortedYears = Object.keys(groupedByYear).sort((a, b) => {
              if (a === 'Unknown') return 1;
              if (b === 'Unknown') return -1;
              return parseInt(b) - parseInt(a);
            });
            const finalArray = sortedYears.map(year => ({
              year,
              works: groupedByYear[year]
            }));
            this.castCredits = finalArray;
            this.repeatCastCredits = finalArray;
            const groupedByDepartment = this.personCombinedCrewCredits.reduce((acc:any, item:any) => {
              const department = item.department;
              const title = item.original_title || item.original_name;
              if (!acc[department]) {
                  acc[department] = {
                      department: department,
                      items: []
                  };
              }
              const existingItem = acc[department].items.find((i:any) => i.title === title);
              if (existingItem) {
                  existingItem.jobs.push({
                      job: item.job,
                      episode_count: item.episode_count || 0
                  });
              } else {
                  acc[department].items.push({
                      title: title,
                      id:item.id,
                      media_type:item.media_type,
                      overview:item.overview,
                      backdrop_path: item.backdrop_path,
                      poster_path: item.poster_path,
                      release_date: item.release_date || item.first_air_date,
                      jobs: [{
                        job: item.job,
                        episode_count: item.episode_count || 0
                    }]
                  });
              }
              return acc;
            }, {});
            const result = Object.values(groupedByDepartment);
            result.forEach((dept:any) => {
              dept.items.sort((a:any, b:any) => {
                  const dateA = a.release_date ? new Date(a.release_date) : (a.first_air_date ? new Date(a.first_air_date) : new Date(0));
                  const dateB = b.release_date ? new Date(b.release_date) : (b.first_air_date ? new Date(b.first_air_date) : new Date(0));
                  return dateB.getTime() - dateA.getTime();
              });
            });
            this.crewCredits = result;
            this.repeatCrewCredits = result;
            this.knownForCast = this.personCombinedCastCredits;
            this.knownForCast = this.personCombinedCastCredits.filter((item:any) => !(item?.character?.includes('Self')) );
            this.knownForCast = this.knownForCast.filter((item:any) => !(item?.character?.includes('Himself')) );
            this.knownForCast = this.knownForCast.filter((item:any) => !(item?.character?.trim() == "") );
            if(this.knownForCast.length >= 20){
              this.knownForCast = this.knownForCast.filter((item:any) => !(item?.vote_count == 0) );
              this.knownForCast = this.knownForCast.filter((item:any) => !(item?.episode_count <= 6) );
            }
            this.knownForCast.sort((a:any, b:any) => {
              if(b.order == undefined){
                b.order = 0;
              }
              if(a.order == undefined){
                a.order = 0;
              }
              const aScore = a.vote_count / (a?.order + 1);
              const bScore = b.vote_count / (b?.order + 1);
              return bScore - aScore;
            });
            this.knownForCrew = this.personCombinedCrewCredits;
            this.knownForCrew = this.knownForCrew.filter((item:any) => !(item?.job?.trim() == "") );
            this.knownForCrew = this.knownForCrew.filter((item:any) => (item?.department === this.personDetails.known_for_department) );
            this.knownCrewCredits = this.knownForCrew.length;
            if(this.knownForCrew.length >= 20){
              this.knownForCrew = this.knownForCrew.filter((item:any) => !(item?.vote_count == 0) );
              this.knownForCrew = this.knownForCrew.filter((item:any) => !(item?.episode_count <= 1) );
            }
            this.knownForCrew.sort((a:any, b:any) => {
              if(b.order == undefined){
                b.order = 0;
              }
              if(a.order == undefined){
                a.order = 0;
              }
              const aScore = a.vote_count / (a?.order + 1);
              const bScore = b.vote_count / (b?.order + 1);
              return bScore - aScore;
            });
            let combinedCrewMap = new Map();
            this.knownForCrew.forEach((item: any) => {
              if (combinedCrewMap.has(item.title ? item.title : item.name)) {
                let existingItem = combinedCrewMap.get(item.title ? item.title : item.name);
                existingItem.job.push(item.job);
              } else {
                combinedCrewMap.set(item.title ? item.title : item.name, {
                  ...item,
                  job: [item.job]
                });
              }
            });
            this.knownForCrew = Array.from(combinedCrewMap.values());
          }
        });
        this._DetailsService.getImages('person',this.personID).subscribe({
          next:(res)=>{
            this.PersonImages = res.profiles;
          }
        });
      }
    });
  }
  toggleText() {
    this.isExpanded = !this.isExpanded;
  }
  chooseMedia(dept: string) {
    this.castCredits = this.repeatCastCredits;
    this.crewCredits = this.repeatCrewCredits;
    if(dept === 'tv' || dept === 'movie'){
      this.castCredits = this.castCredits?.filter((item: any) => 
        item?.works?.some((work: any) => work?.media_type === dept)
      ).map((item:any) => ({
        ...item,
        works: item.works.filter((work:any) => work.media_type === dept)
      }));
      this.crewCredits = this.crewCredits?.filter((item: any) => 
        item?.items?.some((work: any) => work?.media_type === dept)
      ).map((item:any) => ({
        ...item,
        items: item.items.filter((work:any) => work.media_type === dept)
      }));
    }
    else if(dept === 'all'){
      this.castCredits = this.repeatCastCredits;
      this.crewCredits = this.repeatCrewCredits;
    }
    if(dept === 'tv'){
      this.currentChoosen = 'Tv';
    }else if(dept === 'movie'){
      this.currentChoosen = 'Movies';
    }else if(dept === 'all'){
      this.currentChoosen = 'All';
    }
  }
}