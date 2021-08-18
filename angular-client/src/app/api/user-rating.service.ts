import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { UserRating } from '../models/user-rating';
import { Observable } from 'rxjs';

const USER_RATING_URI = "user-rating";

/**
 * API service for rating items
 */
@Injectable()
export class UserRatingService {
    constructor(private http: HttpClient, private auth: AuthService) { }

    /**
     * Rate item
     * @param rating 
     * @returns 
     */
    rateItem(rating: UserRating): Observable<any> {
        return this.auth.token$?.pipe(switchMap((token: any) => {
            const headers: any = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            return this.http.patch(`${environment.baseAPIPath}${USER_RATING_URI}/rate`, rating, { headers });
        }));
    }
}