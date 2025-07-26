export const GameConstants = {
  CARD_DIMENSIONS: { width: 1.6, height: 2.4, depth: 0.01, OPPONENT_CARD_SCALE: 0.8 },
  CARD_SPACING: 0.1,
  ANIMATION_DURATION: 500,
  EASING: 'easeInOutQuad',
  COLOR_SCHEMES: {
    primary: '#4a4a4a',
    secondary: '#ffffff',
    accent: '#ff0000',
  },
  TABLE_DIMENSIONS: { width: 8, height: 6 },
  HAND_POSITIONS: {
    player1: { x: 0, y: -2.5, z: 0 },
    player2: { x: 0, y: 2.5, z: 0 },
  },
  TALON_LAYOUT: {
    position: { x: -2.5, y: 0.5, z: 0 },
  },
  TRICK_AREA_LAYOUT: {
    position: { x: 1, y: 0, z: 0 },
  },
  COLLECTED_TRICKS_LAYOUT: {
    player1: { x: -3, y: -2.5, z: 0 },
    player2: { x: -3, y: 2.5, z: 0 },
  },
  SCHNAPSEN_RULES: {
    POINTS_TO_WIN: 66,
  },
};
