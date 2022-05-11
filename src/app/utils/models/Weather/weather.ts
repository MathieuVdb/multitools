import { Coord } from "./coord";
import { Main } from "./main";
import { Sys } from "./Sys";
import { Wind } from "./wind";

export interface Weather {
    name: string;
    coord: Coord;
    main: Main;
    wind: Wind;
    dt: number;
    sys: Sys;
}