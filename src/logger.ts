/* eslint-disable @typescript-eslint/no-explicit-any */
export type ILogLevel = "debug" | "info" | "warn" | "error" | "none";

enum LogLevel {
    debug,
    info,
    warn,
    error,
    none,
}

class Logger {
    private level: ILogLevel = "info";

    setLogLevel(newLevel: ILogLevel): void {
        this.level = newLevel;
    }

    error(...args: [any?, ...any[]]) {
        if (LogLevel.error < LogLevel[this.level]) return;
        console.error.apply(this, ["E", ...args]);
    }

    info(...args: [any?, ...any[]]) {
        if (LogLevel.info < LogLevel[this.level]) return;
        console.info.apply(this, ["I", ...args]);
    }

    warn(...args: [any?, ...any[]]) {
        if (LogLevel.warn < LogLevel[this.level]) return;
        console.warn.apply(this, ["W", ...args]);
    }

    debug(...args: [any?, ...any[]]) {
        if (LogLevel.debug < LogLevel[this.level]) return;
        console.debug.apply(this, ["D", ...args]);
    }
}

export default new Logger();
