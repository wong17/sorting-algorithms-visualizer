import { SortingAlgorithm } from "./sorting-algorithm";

export class QuickSort extends SortingAlgorithm {

  /**
   * Inicia el proceso de ordenamiento usando quick sort.
   * Reinicia el historial de pasos y llama a la función quick sort.
   * 
   * @param array - El arreglo a ordenar.
   * @returns - El arreglo ordenado.
   */
  override sort(array: number[]): number[] {
    // Reiniciar el paso a paso del algoritmo
    this.steps = [];
    return this.quickSort(array, 0, array.length - 1)
  }

  /**
   * Ordena el arreglo usando el algoritmo QuickSort de forma recursiva.
   * 
   * @param array - El arreglo a ordenar.
   * @param left - El índice izquierdo de la sublista a ordenar.
   * @param right - El índice derecho de la sublista a ordenar.
   * @returns - El arreglo ordenado.
   */
  private quickSort(array: number[], left: number, right: number): number[] {
    if (left >= right) {
      return array;
    }
    // Obtener el índice de partición
    const pivotIndex = this.partition(array, left, right);
    // Registrar el estado actual del arreglo
    this.steps.push([[...array], [left, right], [pivotIndex]]);
    // Ordenar las sublistas a la izquierda y derecha del pivote
    this.quickSort(array, left, pivotIndex - 1);
    this.quickSort(array, pivotIndex + 1, right);

    return array;
  }

  /**
   * Reorganiza el arreglo de modo que todos los elementos menores que el pivote
   * estén a su izquierda y los mayores a su derecha. Luego coloca el pivote en
   * su posición correcta.
   * 
   * @param array - El arreglo a particionar.
   * @param left - El índice izquierdo del rango a particionar.
   * @param right - El índice derecho del rango a particionar.
   * @returns - El índice del pivote después de la partición.
   */
  private partition(array: number[], left: number, right: number): number {
    // Seleccionar el pivote como el último elemento
    const pivotValue = array[right];
    // Empieza una posición más a la izquierda que el primer elemento del arreglo
    let i = (left - 1);
    // Reordenar arreglo, intercambiando elementos que sean menores que el pivote con
    // elementos previamente visitados que eran mayores al pivote
    for (let j = left; j <= right - 1; j++) {
      // Registrar el estado actual del arreglo y los indices que se estan comparando
      this.steps.push([[...array], [j, right], []]);
      if (array[j] < pivotValue) {
        i++;
        // Registrar el estado actual del arreglo y el indice del intercambio
        this.steps.push([[...array], [], [i]]);
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // Registrar el estado del arreglo después de la partición
    this.steps.push([[...array], [right], [i + 1]]);
    // Colocar el pivote en su posición final de modo que el arreglo ahora esta dividido
    // con elementos menores al pivote a su izquierda y mayores que el pivote a su derecha
    [array[i + 1], array[right]] = [array[right], array[i + 1]];

    return i + 1;
  }
}
