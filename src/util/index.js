const EPS = 1e-6;

module.exports = {
    getCoordinatesForPercent(percent, r = 1) {
        let x = Math.cos(2 * Math.PI * percent) * r;
        let y = Math.sin(2 * Math.PI * percent) * r;
    
        return {
            x: x,
            y: y
        };
    },

    randomColor(){
        return `rgba(${Math.round(Math.random(0,1) * 255)}, ${Math.round(Math.random(0,1) * 255)}, ${Math.round(Math.random(0,1) * 255)}, ${Math.random(0.5,1) * 1})`;
    },

    configW(w, o = 0) {
        const s = o <= 0
            ? 1 - o
            : 
            1 / Math.sqrt(1 + Math.pow(2 * Math.PI / Math.log(1 / (o * o)), 2));
    
        const ks = (2 * Math.PI / w) / Math.max(Math.sqrt(1 - s * s), 0.5);
        const c = 2 * ks * s;
        return [ks * ks, c];
    }
};