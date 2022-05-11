import { Flags } from "./flags";
import { Name } from "./name";

export interface Geolocation {
    name: Name;
    country: string;
    flag: string;
    flags: Flags;
}