import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const SEARCH_URI = 'search';

/**
 * API service for searching data source
 */
@Injectable()
export class SearchService {
  constructor(private http: HttpClient) { }

  /**
   * Get specific item by ID
   * @param id
   * @returns 
   */
  getById(id: string): Observable<any> {
    return this.http.get(`${environment.baseAPIPath}${SEARCH_URI}/${id}`);
  }

  /**
   * Search items
   * @param text 
   * @returns 
   */
  search(text: string, offset: number = 0): Observable<any> {
    let params = new HttpParams()
      .set('text', text)
      .set('offset', String(offset));
    return this.http.get(`${environment.baseAPIPath}${SEARCH_URI}`, {params});
  }
}