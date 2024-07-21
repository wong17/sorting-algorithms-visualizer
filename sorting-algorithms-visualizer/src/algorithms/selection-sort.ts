import { SortingAlgorithm } from "./sorting-algorithm";

export class SelectionSort extends SortingAlgorithm {

  /**
   * Inicia el proceso de ordenamiento usando el algoritmo Selection Sort.
   * Reinicia el historial de pasos y llama a la función selectionSort.
   * 
   * @param array - El arreglo a ordenar.
   * @returns - El arreglo ordenado.
   */
  override sort(array: number[]): number[] {
    // Reiniciar el paso a paso del algoritmo
    this.steps = [];
    return this.selectionSort(array, array.length);
  }

  /**
   * Ordena el arreglo usando el algoritmo Selection Sort.
   * 
   * @param array - El arreglo a ordenar.
   * @param n - La longitud del arreglo.
   * @returns - El arreglo ordenado.
   */
  private selectionSort(array: number[], n: number): number[] {
    // Iterar sobre cada elemento del arreglo
    for (let i = 0; i < n; i++) {
      let min = i; // Suponer que el elemento actual es el mínimo

      // Encontrar el elemento más pequeño en el subarreglo restante
      for (let j = i + 1; j < n; j++) {
        // Registrar el estado actual del arreglo y los índices comparados
        this.steps.push([[...array], [min, j], []]);
        if (array[j] < array[min]) {
          min = j;
        }
      }
      // Intercambiar el elemento actual con el elemento mínimo encontrado
      [array[i], array[min]] = [array[min], array[i]];
      // Registrar el estado del arreglo después del intercambio
      this.steps.push([[...array], [], [i, min]]);
    }

    return array;
  }
}
