export class ArrayUtil {

  /**
   * Implementación de Fisher-Yates Sorting Algorithm para generar los pasos de barajado.
   * @param array - El arreglo que se va a barajar
   * @returns - Una lista de pasos (pares de índices) para la animación del barajado
   */
  static prepareShuffle(array: number[]): [number, number][] {
    const shuffleSteps: [number, number][] = [];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      shuffleSteps.push([i, j]);
    }
    return shuffleSteps;
  }

  /**
   * Intercambia de lugar dos elementos del arreglo.
   * @param array - El arreglo que contiene los elementos
   * @param index1 - Índice del primer elemento
   * @param index2 - Índice del segundo elemento
   */
  static swap(array: number[], index1: number, index2: number): void {
    [array[index1], array[index2]] = [array[index2], array[index1]];
  }

  /**
   * Verifica si el arreglo ya está ordenado de forma ascendente.
   * @param array - El arreglo a verificar
   * @returns true si ya está ordenado, caso contrario false
   */
  static isSorted(array: number[]): boolean {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        return false;
      }
    }
    return true;
  }

}
