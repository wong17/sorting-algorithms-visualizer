import { SortingAlgorithm } from "./sorting-algorithm";

export class BubbleSort extends SortingAlgorithm {

  /**
   * Inicia el proceso de ordenamiento usando el algoritmo Bubble Sort.
   * Reinicia el historial de pasos y llama a la función bubbleSort.
   * 
   * @param array - El arreglo a ordenar.
   * @returns - El arreglo ordenado.
   */
  override sort(array: number[]): number[] {
    // Reiniciar el paso a paso del algoritmo
    this.steps = [];
    return this.bubbleSort(array, array.length);
  }

  /**
   * Ordena el arreglo usando el algoritmo Bubble Sort.
   * 
   * @param array - El arreglo a ordenar.
   * @param n - La longitud del arreglo.
   * @returns - El arreglo ordenado.
   */
  private bubbleSort(array: number[], n: number): number[] {
    // Iterar sobre cada elemento del arreglo
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        // Registrar el estado actual del arreglo y los índices comparados
        this.steps.push([[...array], [j, j + 1], []]);
        if (array[j] > array[j + 1]) {
          // Intercambiar si el elemento actual es mayor que el siguiente
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          // Registrar el estado después del intercambio
          this.steps.push([[...array], [], [j]]);
        }
      }
    }
    return array;
  }
}
