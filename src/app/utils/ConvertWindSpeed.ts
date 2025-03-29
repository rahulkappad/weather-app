

export function ConvertWindSpeed(speedInMeteePerSecond : number) : string {
    const speedInKilometersPerHour = speedInMeteePerSecond * 3.6;
    return `${speedInKilometersPerHour.toFixed(0)}Km/h`
}