function roundOffNumber(value: number, decimalPlaces: number) {
    if (value === null || value === undefined) throw new Error('Value is undefined or null');
    return Math.round((value + Number.EPSILON) * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

function formatValueInUsd(value: number, decimalPlaces: number) {
    if (value === null || value === undefined) throw new Error('Value is undefined or null');
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: decimalPlaces ? decimalPlaces : 2
    }).format(value);
}

function formatValueIntoCommaSeparated(value: number, decimalPlaces?: number, withCurrencySymbol?: boolean) {
    if (value === null || value === undefined) throw new Error('Value is undefined or null');
    return new Intl.NumberFormat('en-US', {
        style: withCurrencySymbol ? 'currency' : undefined,
        currency: withCurrencySymbol ? 'USD' : undefined,
        maximumFractionDigits: withCurrencySymbol ? 5 : undefined
    }).format(roundOffNumber(value, decimalPlaces ? decimalPlaces : 2));
}

export { roundOffNumber, formatValueInUsd, formatValueIntoCommaSeparated }