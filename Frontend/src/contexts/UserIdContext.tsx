import { createContext } from "react";

export const UserIdContext = createContext({
    username: "",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    SetUsername: (_username: string) => {}
});