import { SortingAlgorithm } from "./sorting-algorithm";

export class MergeSort extends SortingAlgorithm {

  /**
   * Inicia el proceso de ordenamiento usando merge sort.
   * Reinicia el historial de pasos y llama a la función recursiva de merge sort.
   * 
   * @param array - El arreglo a ordenar.
   * @returns - El arreglo ordenado.
   */
  override sort(array: number[]): number[] {
    // Reiniciar el paso a paso del algoritmo
    this.steps = [];
    return this.mergeSort(array, 0, array.length - 1);
  }

  /**
   * Divide el arreglo original en mitades de forma recursiva hasta que esas mitades no puedan dividirse más
   * (hasta que quede solo 1 elemento), y luego empieza a comparar y unir esas mitades para formar el arreglo ordenado.
   * 
   * @param array - El arreglo a ordenar.
   * @param left - Índice inicial del subarreglo.
   * @param right - Índice final del subarreglo.
   * @returns - El arreglo parcialmente ordenado.
   */
  private mergeSort(array: number[], left: number, right: number): number[] {
    if (left >= right) {
      return array;
    }
    // Calcular el índice medio del arreglo
    const mid = Math.floor((left + right) / 2);
    // Dividir el arreglo en mitades de forma recursiva hasta que no pueda seguirse dividiendo
    this.mergeSort(array, left, mid);
    this.mergeSort(array, mid + 1, right);
    // Unir las mitades para formar el arreglo ordenado
    this.merge(array, left, mid, right);

    return array;
  }

  /**
   * Compara y une dos mitades del arreglo para formar un subarreglo ordenado.
   * 
   * @param array - El arreglo a ordenar.
   * @param left - Índice inicial del primer subarreglo.
   * @param mid - Índice medio que divide los dos subarreglos.
   * @param right - Índice final del segundo subarreglo.
   */
  private merge(array: number[], left: number, mid: number, right: number): void {
    // Calcular el tamaño de los subarreglos
    const n1 = mid - left + 1;
    const n2 = right - mid;
    // Crear arreglos temporales para almacenar los elementos de cada mitad
    const leftArray = new Array(n1);
    const rightArray = new Array(n2);
    // Copiar los elementos en los arreglos temporales
    for (let i = 0; i < n1; i++) {
      leftArray[i] = array[left + i];
    }
    for (let j = 0; j < n2; j++) {
      rightArray[j] = array[mid + 1 + j];
    }

    /**
     * i: indice inicial del primer sub arreglo (primer mitad)
     * j: indice inicial del segundo sub arreglo (segunda mitad)
     * k: indice inicial del arreglo que contiene los dos sub arreglos juntos (primer mitad + segunda mitad)
     */
    let i = 0, j = 0, k = left;
    // Comparar elementos de la misma posición en ambas mitades
    while (i < n1 && j < n2) {
      // Agregar el estado actual del arreglo y los índices comparados a los pasos 
      this.steps.push([[...array], [left + i, mid + 1 + j], []]);
      if (leftArray[i] <= rightArray[j]) {
        array[k] = leftArray[i];
        i++;
      }
      else {
        array[k] = rightArray[j];
        j++;
      }
      // Agregar el estado actual del arreglo y el índice intercambiado a los pasos
      this.steps.push([[...array], [], [k]]);
      k++;
    }

    // Copiar los elementos restantes de la primera mitad, si los hay
    while (i < n1) {
      // Agregar el estado actual del arreglo y el índice comparado a los pasos
      this.steps.push([[...array], [left + i], []]);
      array[k] = leftArray[i];
      // Agregar el estado actual del arreglo y el índice intercambiado a los pasos
      this.steps.push([[...array], [], [k]]);
      i++;
      k++;
    }
    // Copiar los elementos restantes de la segunda mitad, si los hay
    while (j < n2) {
      // Agregar el estado actual del arreglo y el índice comparado a los pasos
      this.steps.push([[...array], [mid + 1 + j], []]);
      array[k] = rightArray[j];
      // Agregar el estado actual del arreglo y el índice intercambiado a los pasos
      this.steps.push([[...array], [], [k]]);
      j++;
      k++;
    }
  }
}
