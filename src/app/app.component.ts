import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { debounceTime, finalize, repeat } from 'rxjs';
import { WeatherService } from './service/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly service: WeatherService) {}

  public newCity: string = '';
  public weathers: any[] = [];
  public cities: string[] = [];

  ngOnInit(): void {
    this.getCities();
  }

  private getCities(): void {
    let cities: string | null = localStorage.getItem('cities');

    if (!cities) {
      this.cities = ['porto alegre', 'papai', 'noel', 'curitiba', 'para'];
      this.addLocalStorage();

      cities = localStorage.getItem('cities') ?? '';
    }

    this.cities = cities.split(',').map((city): string => {
      return this.removeAccents(city.trim());
    });

    this.cities.forEach((city): void => {
      this.getWeather(city);
    });
  }

  private getWeather(city: string): void {
    this.service
      .LoadRightWeather(city)
      .pipe(
        finalize((): void => {
          this.newCity = '';
          this.weathers = this.sort(this.weathers, {
            atribute: ['name'],
            order: 'DESC',
          });
        })
      )
      .subscribe({
        next: (weather): void => {
          const includesCity: boolean = this.cities.includes(city);
          !includesCity && this.cities.push(city.toLowerCase());

          this.weathers.push(weather);
          this.addLocalStorage();
        },
        error: (err: HttpErrorResponse): void => {
          const message = err.error.message;
          alert(message);
        },
      });
  }

  private addLocalStorage(): void {
    localStorage.setItem('cities', this.cities.toString());
  }

  public removeCity(index: number, cityName: string): void {
    this.cities = this.cities.filter((city): boolean => {
      return city != this.removeAccents(cityName.toLowerCase());
    });

    this.addLocalStorage();

    this.weathers.splice(index, 1);
  }

  public addNewCity(): void {
    const city: string = this.newCity.trim().toLowerCase();

    const includesCity: boolean = this.cities.includes(city);

    if (includesCity) {
      alert(`This city is already listed`);

      this.newCity = '';
      return;
    }

    city && this.getWeather(this.removeAccents(city));
  }

  // TODO utils

  /**
   * @author Natan Cipriano <natancipriano98@gmail.com>
   * @description
   * Ordena o array
   * @todo Mostrar o atributo desejado para realizar a ordenação
   * @param objectArray Array a qual deseja realizar a ordenação
   * @param options Define as configurações para a ordenação
   * @returns O Array ordenado
   */
  public sort<ObjectArray>(
    objectArray: ObjectArray[],
    options: {
      /**
       * @description
       * Atributo a qual deseja realizar ordenação
       */
      atribute?: string[];
      /**
       * @description
       * Define a ordenação se é `ASC` ou `DESC`
       * @default 'ASC'
       */
      order?: 'ASC' | 'DESC';
    } = {}
  ): ObjectArray[] {
    options.order ??= 'ASC';

    return objectArray.sort((a: ObjectArray, b: ObjectArray): 1 | 0 | -1 => {
      const getAtribute = (currentSort: string): string => {
        let atributeFormated: string = '';
        options.atribute?.forEach((string): void => {
          atributeFormated += `.${string}`;
        });

        const response = isNaN(eval(`${currentSort}${atributeFormated}`))
          ? `${currentSort}${atributeFormated}.toLowerCase()`
          : `${currentSort}${atributeFormated}`;

        return response;
      };

      if (eval(getAtribute('a')) > eval(getAtribute('b'))) {
        return options.order === 'ASC' ? 1 : -1;
      }
      if (eval(getAtribute('a')) < eval(getAtribute('b'))) {
        return options.order === 'ASC' ? -1 : 1;
      }

      return 0;
    });
  }

  private removeAccents(text: string): string {
    text = text
      ?.toLowerCase()
      .replace(new RegExp(/[\xE0-\xE6]/g), 'a')
      .replace(new RegExp(/[\xE8-\xEB]/g), 'e')
      .replace(new RegExp(/[\xEC-\xEF]/g), 'i')
      .replace(new RegExp(/[\xF2-\xF6]/g), 'o')
      .replace(new RegExp(/[\xF9-\xFC]/g), 'u')
      .replace(new RegExp(/\xE7/g), 'c')
      .replace(new RegExp(/\xF1/g), 'n');
    return text;
  }
}
