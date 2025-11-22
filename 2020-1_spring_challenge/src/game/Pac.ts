export enum PacType {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
  DEAD = "DEAD",
}

export interface Pac {
  id: number;

  xPos: number;
  yPos: number;

  pacType: PacType;

  speedTurnsLeft: number;
  abilityCooldown: number;
}
