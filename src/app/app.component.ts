import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { finalize } from 'rxjs'
import { WeatherSchema } from './model/weather.model'
import { WeatherService } from './service/weather.service'
import { UtilsService } from './shared/services/utils/utils.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly service: WeatherService,
    private readonly utils: UtilsService
  ) {}

  public newCity: string = ''
  public weathers: WeatherSchema[] = []
  public loading: boolean = false

  private cities: string[] = []

  ngOnInit(): void {
    this.getCities()
  }

  private getCities(): void {
    let cities: string | null = localStorage.getItem('cities')

    if (!cities) {
      this.cities = ['porto alegre', 'papai', 'noel', 'curitiba', 'para']
      this.addLocalStorage()

      cities = localStorage.getItem('cities') ?? ''
    }

    this.cities = cities.split(',').map((city): string => {
      return this.utils.removeAccents(city.trim())
    })

    this.cities.forEach((city): void => {
      this.getWeather(city)
    })
  }

  private getWeather(city: string): void {
    this.loading = true
    this.service
      .LoadRightWeather(city)
      .pipe(
        finalize((): void => {
          this.newCity = ''
          this.loading = false

          this.weathers = this.utils.sort(this.weathers, {
            atribute: ['name'],
            order: 'DESC'
          })
        })
      )
      .subscribe({
        next: (weather): void => {
          const includesCity: boolean = this.cities.includes(city)
          !includesCity && this.cities.push(city.toLowerCase())

          this.weathers.push(weather)
          this.addLocalStorage()
        },
        error: (err: HttpErrorResponse): void => {
          const message = err.error.message
          alert(message)
        }
      })
  }

  private addLocalStorage(): void {
    localStorage.setItem('cities', this.cities.toString())
  }

  public removeCity(index: number, cityName: string): void {
    this.cities = this.cities.filter((city): boolean => {
      return city != this.utils.removeAccents(cityName.toLowerCase())
    })

    this.addLocalStorage()

    this.weathers.splice(index, 1)
  }

  public addNewCity(): void {
    const city: string = this.newCity.trim().toLowerCase()

    const includesCity: boolean = this.cities.includes(city)

    if (includesCity) {
      alert(`This city is already listed`)

      this.newCity = ''
      return
    }

    city && this.getWeather(this.utils.removeAccents(city))
  }
}
