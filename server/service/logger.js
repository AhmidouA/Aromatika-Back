const { createLogger, transports, format } = require("winston");

const path = require("path");

const logsDir = path.join(__dirname, "../logs");

const customerLogger = createLogger({
  transports: [
    new transports.File({
      filename: path.join(logsDir, "customer-error.log"),

      level: "error",

      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.json(),
        format.printf(({ level, message, timestamp, url, method }) => {
          return `Date:[${timestamp}] [${level.toUpperCase()}] Methode:[${method}] Routes:[${url}] ${message}`;
        })
      ),
    }),
  ],
});

module.exports = { customerLogger };
