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

  ngOnInit(): void {
    this.getCities()
  }

  private getCities(): void {
    const defaultWeathers: Partial<WeatherSchema>[] = [
      { name: 'Porto Alegre' },
      { name: 'Papai' },
      { name: 'Noel' },
      { name: 'Curitiba' },
      { name: 'Pará' }
    ]

    const storage = JSON.parse(
      localStorage.getItem('weathers') ?? '{}'
    ) as WeatherSchema[]

    const weathers = storage.length ? storage : defaultWeathers

    this.updateStorage()
    weathers.forEach(weather => {
      this.newCity = weather.name ?? ''
      this.addNewCity()
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
        next: (weatherResponse): void => {
          const includesCity: boolean = this.includesCity(weatherResponse.name)

          if (!includesCity) {
            this.weathers.push(weatherResponse)
            this.updateStorage()
          }
        },
        error: (err: HttpErrorResponse): void => {
          const message = err.error.message
          alert(message)
        }
      })
  }

  private updateStorage(): void {
    const weathers: Partial<WeatherSchema>[] = this.weathers.map(weather => {
      return {
        name: weather.name
      }
    })

    localStorage.setItem('weathers', JSON.stringify(weathers))
  }

  private includesCity(city: string): boolean {
    const includesCity: boolean = !!this.weathers.find(weather => {
      return weather.name.toLowerCase() === city.toLowerCase()
    })

    includesCity && alert(`This city is already listed`)

    return includesCity
  }

  public removeCity(index: number, cityName: string): void {
    this.weathers.splice(index, 1)
    this.updateStorage()
  }

  public addNewCity(): void {
    const city: string = this.newCity.trim().toLowerCase()

    const includesCity: boolean = this.includesCity(city)
    !includesCity && city && this.getWeather(city)

    this.newCity = ''
  }
}
