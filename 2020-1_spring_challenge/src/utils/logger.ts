import {Pac} from "../Pac";

export function logComment(comment: string) {
    console.error(`Comment: ${comment}`);
}

export function logPacs(pacs: Pac[]) {
    for (const pac of pacs) {
        console.error(`Pac: ${pac.id}`);
        console.error(`Pos: (${pac.xPos}, ${pac.yPos})`);
        console.error(`Type: ${pac.pacType}`);
        console.error(`Speed turns left: ${pac.speedTurnsLeft}`);
        console.error(`Ability cooldown: (${pac.abilityCooldown})`);
        console.error();
    }
}