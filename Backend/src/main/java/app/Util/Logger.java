package app.Util;

public class Logger {
    private static Logger self = null;

    private static final String PREFIX = "[LOGGER]: ";

    public static Logger GetInstance() {
        if (self == null) {
            self = new Logger();
        }

        return self;
    }

    public static void LogMessage(String msg) {
        System.out.println(PREFIX + msg);
    }

    public static void ReceivedRequest(String route) {
        System.out.println(PREFIX + "Received " + route + " request");
    }
}
