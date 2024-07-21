export class ColorUtil {

  /**
    * Genera un color RGB en base a la altura de la barra, interpolando entre dos colores.
    * @param height Altura de la barra
    * @param maxBarHeight Altura máxima de la barra
    * @param startColor Color de inicio { r, g, b }
    * @param endColor Color de fin { r, g, b }
    * @returns Color en formato RGB
    */
  static getColorForHeight(
    height: number,
    maxBarHeight: number,
    startColor: { r: number, g: number, b: number },
    endColor: { r: number, g: number, b: number }
  ): string {
    const ratio = height / maxBarHeight;

    const r = Math.floor(startColor.r + ratio * (endColor.r - startColor.r));
    const g = Math.floor(startColor.g + ratio * (endColor.g - startColor.g));
    const b = Math.floor(startColor.b + ratio * (endColor.b - startColor.b));

    return `rgb(${r}, ${g}, ${b})`;
  }
}
