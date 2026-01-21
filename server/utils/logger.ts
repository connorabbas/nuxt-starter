import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // structured logs
    ),
    transports: [
        new winston.transports.File({ filename: 'server/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'server/logs/combined.log' })
        // add other log files for different severities as needed (ex. info, debug)
    ]
})

// If in development, also log to console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

export default logger
