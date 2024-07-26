export class ArrayUtil {

  /**
   * Desordenar el arreglo y generar el paso a paso de la animación, utiliza una implementación de Fisher-Yates Shuffle Algorithm
   * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
   * @param array - El arreglo que se va a desordenar
   * @returns - Una lista de pasos (pares de índices) para la animación de desordenado
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
   * Genera un arreglo de números aleatorios [1, n-1] sin repetición, utiliza una implementación de Fisher-Yates Shuffle Algorithm
   * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
   * @param n - El número máximo de elementos en el arreglo.
   * @returns Un arreglo de números aleatorios.
   */
  static random(n: number): number[] {
    const array = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.swap(array, i, j);
    }
    return array;
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
