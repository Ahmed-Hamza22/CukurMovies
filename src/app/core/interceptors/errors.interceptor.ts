import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((err:HttpErrorResponse)=>{
    console.log("INTERCEPTOR", err);
    return throwError(()=>err)
  }));
};