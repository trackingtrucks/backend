import rateLimit from 'express-rate-limit'
export const l30s5r = rateLimit({
    windowMs: 30 * 1000, //30 segundos
    max: 5,
    message: "Demasiadas requests en un lapso corto de tiempo",
})

export const l60s5r = rateLimit({
    windowMs: 1* 60 * 1000, //60 segundos
    max: 5,
    message: "Demasiadas requests en un lapso corto de tiempo",
})

export const l5m5r = rateLimit({
    windowMs: 5 * 60 * 1000, //5 minutos
    max: 5,
    message: "Demasiadas requests en un lapso corto de tiempo",
})

export const l1h3r = rateLimit({
    windowMs: 1 * 60 * 60 * 1000, //1 hora
    max: 3,
    message: "Demasiadas requests en un lapso corto de tiempo",
})