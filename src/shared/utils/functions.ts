
const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const distance = (lat1: number, lon1: number, lat2: number, lon2: number, unit: string = 'km') => {
    const R = unit === 'km' ? 6371 : 3958.8;
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

export var getStackTrace = function() {
    var obj: any = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
};

// console.log("DISTANCE: " + distance(4.64169, -74.075942,4.640116,-74.076031));
// expected: 0.17365 km (google maps) , output: 0.17529855129100733 km
// medium error: 1.6485512910073303 m (for short distances)

