import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private readonly httpClient: HttpClient) {}

  public LoadRightWeather(city: string): Observable<any> {
    const url: string = 'https://api.openweathermap.org/data/2.5/weather';
    const APPID: string = '047bcea09682273b2c0d065d4566861a';
    const queryParam: string = `q=${city}&&APPID=${APPID}&units=metric`;

    return this.httpClient.get(`${url}?${queryParam}`);
  }
}
