import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
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

  public removeAccents(text: string): string {
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
