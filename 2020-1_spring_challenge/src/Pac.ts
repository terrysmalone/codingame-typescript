import {PacType} from "./PacType";

export interface Pac {
    id: number;

    xPos: number;
    yPos: number;

    pacType: PacType;

    speedTurnsLeft: number;
    abilityCooldown: number;
}