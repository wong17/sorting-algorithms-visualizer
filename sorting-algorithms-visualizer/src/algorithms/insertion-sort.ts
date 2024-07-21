import { SortingAlgorithm } from "./sorting-algorithm";

export class InsertionSort extends SortingAlgorithm {

  /**
   * Inicia el proceso de ordenamiento usando el algoritmo Insertion Sort.
   * Reinicia el historial de pasos y llama a la función insertionSort.
   * 
   * @param array - El arreglo a ordenar.
   * @returns - El arreglo ordenado.
   */
  override sort(array: number[]): number[] {
    // Reiniciar el paso a paso del algoritmo
    this.steps = [];
    return this.insertionSort(array, array.length)
  }

  /**
   * Ordena el arreglo usando el algoritmo Insertion Sort.
   * 
   * @param array - El arreglo a ordenar.
   * @param n - La longitud del arreglo.
   * @returns - El arreglo ordenado.
   */
  private insertionSort(array: number[], n: number): number[] {
    // Iterar sobre cada elemento del arreglo a partir del segundo
    for (let i = 0; i < n; i++) {
      let tempElement = array[i]; // Guardar el elemento actual
      let j = i - 1;

      // Registrar el estado inicial antes de empezar a comparar
      this.steps.push([[...array], [i], [j]]);

      // Mover los elementos mayores que el elemento actual a una posición a la derecha
      while (j >= 0 && array[j] > tempElement) {
        // Registrar el estado del arreglo y los indices que se estaban comparando
        this.steps.push([[...array], [j, i], []]);
        array[j + 1] = array[j];
        j--;
        // Registrar el estado del arreglo y el indice donde se mueve el elemento
        this.steps.push([[...array], [], [j + 1]]);
      }
      // Insertar el elemento temporal en la posición correcta
      array[j + 1] = tempElement;
      // Registrar el estado después de insertar la clave
      this.steps.push([[...array], [], [j + 1]]);
    }

    return array;
  }
}
