import supportedFilters from './filters';

function filters(filters) {
    return Object.keys(filters).map(f => `${f}(${filters[f].value}${supportedFilters[f].unit})`).join(' ');
};

export default function (layer) {
    return {
        filter: layer && layer.filters && filters(layer.filters),
        'mix-blend-mode': layer && layer.blend
    }
};

export function orientationClasses(orientation) {
    return {
        1: "max-h-full",
        8: "w-full transform -rotate-90",
        6: "w-full transform rotate-90"
    }[orientation || 1]
}