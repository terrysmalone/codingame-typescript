import { Position } from "../utils/Position";

export enum PacType {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
  DEAD = "DEAD",
}

export interface Pac {
  id: number;

  position: Position;

  pacType: PacType;

  speedTurnsLeft: number;
  abilityCooldown: number;
}
