import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  /**
   * @author Natan Cipriano <natancipriano98@gmail.com>
   * @description
   * Ordena o array
   * @param objectArray Array a qual deseja realizar a ordenação
   * @param options Define as configurações para a ordenação
   * @returns Array ordenado
   */
  public sort<ObjectArray>(
    objectArray: ObjectArray[],
    options: {
      /**
       * @description
       * Atributo a qual deseja realizar ordenação
       */
      atribute?: string[]
      /**
       * @description
       * Define a ordenação se é `ASC` ou `DESC`
       * @default 'ASC'
       */
      order?: 'ASC' | 'DESC'
    } = {}
  ): ObjectArray[] {
    options.order ??= 'ASC'

    return objectArray.sort((a: ObjectArray, b: ObjectArray): 1 | 0 | -1 => {
      const getAtribute = (currentSort: string): string => {
        let atribute: string = ''

        options.atribute?.forEach((string): void => {
          atribute += `.${string}`
        })

        const response = isNaN(eval(`${currentSort}${atribute}`))
          ? `${currentSort}${atribute}.toLowerCase()`
          : `${currentSort}${atribute}`

        return response
      }

      if (eval(getAtribute('a')) > eval(getAtribute('b'))) {
        return options.order === 'ASC' ? 1 : -1
      }

      if (eval(getAtribute('a')) < eval(getAtribute('b'))) {
        return options.order === 'ASC' ? -1 : 1
      }

      return 0
    })
  }
}
