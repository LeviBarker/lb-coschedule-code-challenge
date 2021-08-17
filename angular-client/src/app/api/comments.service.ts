import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';

const COMMENTS_URI = "comments";

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient, private auth: AuthService) { }

  create({ message, sourceId }: { message: string, sourceId: string }) {
    return this.auth.token$?.pipe(switchMap((token: any) => {
      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return this.http.post(`${environment.baseAPIPath}${COMMENTS_URI}`, {
        message,
        sourceId
      }, {headers});
    }));
  }

  delete(id: string) {
    return this.auth.token$?.pipe(switchMap((token: any) => {
      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return this.http.delete(`${environment.baseAPIPath}${COMMENTS_URI}/${id}`, {headers});
    }));
  }
}