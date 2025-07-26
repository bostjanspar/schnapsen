import { GameConstants } from '../logic/game.constants';

export class CardLayout {
  static calculateHandPositions(cardCount: number): any[] {
    const positions = [];
    for (let i = 0; i < cardCount; i++) {
      positions.push({
        x: (i - (cardCount - 1) / 2) * (GameConstants.CARD_DIMENSIONS.width + GameConstants.CARD_SPACING),
        y: GameConstants.HAND_POSITIONS.player1.y,
        z: 0,
      });
    }
    return positions;
  }

  static getTalonLayout(): any {
    return GameConstants.TALON_LAYOUT;
  }

  static getTrickAreaLayout(): any {
    return GameConstants.TRICK_AREA_LAYOUT;
  }

  static getCollectedTricksLayout(): any {
    return GameConstants.COLLECTED_TRICKS_LAYOUT;
  }
}
