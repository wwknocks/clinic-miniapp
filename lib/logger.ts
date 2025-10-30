type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    const formattedMessage = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case "debug":
        if (this.isDevelopment) {
          console.debug(formattedMessage, context || "");
        }
        break;
      case "info":
        console.info(formattedMessage, context || "");
        break;
      case "warn":
        console.warn(formattedMessage, context || "");
        break;
      case "error":
        console.error(formattedMessage, context || "");
        break;
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log("error", message, context);
  }
}

export const logger = new Logger();
