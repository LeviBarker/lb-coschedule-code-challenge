import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const SEARCH_URI = "search";

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) { }

  search(text: string) {
      return this.http.get(`${environment.baseAPIPath}${SEARCH_URI}?text=${text}`);
  }
}