import '@testing-library/jest-dom'

// Mock HTMLCanvasElement for ECharts compatibility in jsdom
HTMLCanvasElement.prototype.getContext = function () {
  return {
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    fillRect: () => {},
    fillText: () => {},
    strokeText: () => {},
    drawImage: () => {},
    scale: () => {},
    translate: () => {},
    rotate: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    measureText: () => ({ width: 10 }),
    setTransform: () => {},
    rect: () => {},
    clip: () => {},
    canvas: { width: 0, height: 0 },
  } as unknown as CanvasRenderingContext2D
}
