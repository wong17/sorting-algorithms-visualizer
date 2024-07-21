import { BubbleSort } from "./bubble-sort";
import { InsertionSort } from "./insertion-sort";
import { MergeSort } from "./merge-sort";
import { QuickSort } from "./quick-sort";
import { SelectionSort } from "./selection-sort";
import { SortingAlgorithm } from "./sorting-algorithm";

export class SortingAlgorithmManager {

  /**
   * Algoritmos disponibles para seleccionar
   */
  private static algorithms: { [key: string]: SortingAlgorithm } = {
    quickSort: new QuickSort(),
    mergeSort: new MergeSort(),
    insertionSort: new InsertionSort(),
    selectionSort: new SelectionSort(),
    bubbleSort: new BubbleSort()
  };

  /**
    * Obtiene una instancia del algoritmo de ordenamiento seleccionado.
    * @param algorithmName - El nombre del algoritmo de ordenamiento.
    * @returns Una instancia del algoritmo de ordenamiento.
    */
  static getAlgorithmInstance(algorithmName: string): SortingAlgorithm | null {
    return this.algorithms[algorithmName] || null;
  }

}
