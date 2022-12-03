import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherSchema } from '../model/weather.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private readonly httpClient: HttpClient) {}

  private readonly api: string = environment.api;
  private readonly appid: string = environment.appid;

  public LoadRightWeather(city: string): Observable<WeatherSchema> {
    const queryParam: string = `q=${city}&APPID=${this.appid}&units=metric`;

    return this.httpClient.get<WeatherSchema>(`${this.api}?${queryParam}`);
  }
}
