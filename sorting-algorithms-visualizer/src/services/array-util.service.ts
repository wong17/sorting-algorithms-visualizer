import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArrayUtilService {

  constructor() { }

  /**
   * Implementación de Fisher-Yates Sorting Algorithm
   * @param array 
   * @returns a shuffled array
   */
  shuffle(array: number[]): number[] {
    const shuffledArray: number[] = array.slice();

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  }

  /**
   * Intercambia de lugar dos elementos del arreglo
   * @param array 
   * @param index1 
   * @param index2 
   * @returns 
   */
  swap(array: number[], index1: number, index2: number): number[] {
    const modifiedArray: number[] = array.slice();
    [modifiedArray[index1], modifiedArray[index2]] = [modifiedArray[index2], modifiedArray[index1]];

    return modifiedArray;
  }
}
