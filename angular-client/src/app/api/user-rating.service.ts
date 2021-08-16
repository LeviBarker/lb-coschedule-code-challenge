import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';

const USER_RATING_URI = "user-rating";

@Injectable()
export class UserRatingService {
    constructor(private http: HttpClient, private auth: AuthService) { }

    rateItem(data?: any) {
        return this.auth.token$?.pipe(switchMap((token: any) => {
            const headers: any = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            return this.http.patch(`${environment.baseAPIPath}${USER_RATING_URI}/rate`, data, { headers });
        }));
    }
}