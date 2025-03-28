export function Convertkalvintocelcius(tempINkelvin :number):number {
    const tempInCelsius = tempINkelvin - 273.15;
    return Math.floor(tempInCelsius)
}