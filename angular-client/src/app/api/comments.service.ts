import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

const COMMENTS_URI = 'comments';

/**
 * API service for Comments
 */
@Injectable()
export class CommentsService {
  constructor(private http: HttpClient,
    private auth: AuthService) { }

  /**
   * API call to create comment
   * @param comment 
   * @returns 
   */
  create(comment: Comment): Observable<Comment> {
    return this.auth.token$?.pipe(switchMap((token: any) => {
      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return this.http.post(`${environment.baseAPIPath}${COMMENTS_URI}`, comment, { headers });
    })) as Observable<Comment>;
  }

  /**
   * API call to create comment
   * @param comment 
   * @returns 
   */
  update(comment: Partial<Comment>): Observable<Comment> {
    return this.auth.token$?.pipe(switchMap((token: any) => {
      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return this.http.put(`${environment.baseAPIPath}${COMMENTS_URI}`, comment, { headers });
    })) as Observable<Comment>;
  }

  /**
   * API call to delete comment by ID
   * @param id 
   * @returns 
   */
  delete(id: string): Observable<any> {
    return this.auth.token$?.pipe(switchMap((token: any) => {
      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return this.http.delete(`${environment.baseAPIPath}${COMMENTS_URI}/${id}`, { headers });
    }));
  }
}