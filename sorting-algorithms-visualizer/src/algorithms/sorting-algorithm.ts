export abstract class SortingAlgorithm {

  /**
   * Arreglo que contiene el paso a paso del algoritmo para poder crear la animación
   * 
   * arrayState: El estado del arreglo en un paso en específico de la animación.
   * comparingIndices: Los índices de los elementos que se están comparando en este paso.
   * swappingIndices: Los índices de los elementos que se están intercambiando en este paso.
   */
  public steps: [number[], number[], number[]][] = [];

  /**
   * Arreglo a ordenar
   * @param array 
   */
  abstract sort(array: number[]): number[];
}
