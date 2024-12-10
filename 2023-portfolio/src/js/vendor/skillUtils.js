const closestEdge = (x, y, w, h) => {
    const topEdgeDist = distMetric(x, y, w / 2, 0);
    const bottomEdgeDist = distMetric(x, y, w / 2, h);
    const leftEdgeDist = distMetric(x, y, w, h / 2);
    const rightEdgeDist = distMetric(x, y, 0, h / 2);
    // const min = Math.min(topEdgeDist, bottomEdgeDist);
    const min1 = Math.min(leftEdgeDist, rightEdgeDist);
    return min1 === rightEdgeDist ? 'left' : 'right';
    // return min === topEdgeDist ? 'top' : 'bottom';
}

const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return (xDiff * xDiff) + (yDiff * yDiff);
}

export { closestEdge, distMetric };