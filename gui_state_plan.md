# Minimal GUI State Plan for Schnapsen Card Game

## Overview
Create the simplest possible GUI state to capture what cards are currently visible in each area of the game.

## 1. Core State Structure

```typescript
interface GUIState {
  playerCards: Card[]           // Cards in player's hand
  opponentCards: Card[]         // Cards in opponent's hand  
  currentTrick: Card[]          // Cards in current trick (max 2)
  playerWonTricks: Card[]       // Cards player has won
  opponentWonTricks: Card[]     // Cards opponent has won
  talonCards: Card[]           // Remaining talon cards
  trumpCard: Card | null       // Trump card (adut)
}
```

## 2. GUIStateManager Class

```typescript
class GUIStateManager {
  private scene: GameScene;
  
  constructor(scene: GameScene) {
    this.scene = scene;
  }

  // Capture current state from scene
  captureState(): GUIState {
    return {
      playerCards: this.getCardsFromGroup(this.scene.playerHandGroup),
      opponentCards: this.getCardsFromGroup(this.scene.opponentHandGroup),
      currentTrick: this.getCardsFromGroup(this.scene.currentTrickGroup),
      playerWonTricks: this.getCardsFromGroup(this.scene.playerTricksGroup),
      opponentWonTricks: this.getCardsFromGroup(this.scene.opponentTricksGroup),
      talonCards: this.getCardsFromGroup(this.scene.talonGroup),
      trumpCard: this.getTrumpCard()
    };
  }

  // Restore state to scene
  restoreState(state: GUIState): void {
    this.clearAllGroups();
    this.createCardsInGroup(state.playerCards, this.scene.playerHandGroup, 'fan');
    this.createCardsInGroup(state.opponentCards, this.scene.opponentHandGroup, 'fan');
    this.createCardsInGroup(state.currentTrick, this.scene.currentTrickGroup, 'line');
    this.createCardsInGroup(state.playerWonTricks, this.scene.playerTricksGroup, 'pile');
    this.createCardsInGroup(state.opponentWonTricks, this.scene.opponentTricksGroup, 'pile');
    this.createCardsInGroup(state.talonCards, this.scene.talonGroup, 'stack');
    if (state.trumpCard) {
      this.createTrumpCard(state.trumpCard);
    }
  }

  // Helper methods
  private getCardsFromGroup(group: THREE.Group): Card[] { /* implementation */ }
  private clearAllGroups(): void { /* implementation */ }
  private createCardsInGroup(cards: Card[], group: THREE.Group, layout: string): void { /* implementation */ }
  private getTrumpCard(): Card | null { /* implementation */ }
  private createTrumpCard(card: Card): void { /* implementation */ }
}
```

## 3. Integration with GameScene

### Add to GameScene constructor:
```typescript
constructor() {
  super();
  this.guiStateManager = new GUIStateManager(this);
  // ... rest of constructor
}
```

### Add method to GameScene:
```typescript
public saveCurrentState(): GUIState {
  return this.guiStateManager.captureState();
}

public loadState(state: GUIState): void {
  this.guiStateManager.restoreState(state);
}
```

## 4. Usage Example

```typescript
// Save current state
const currentState = gameScene.saveCurrentState();

// Later, restore that state
gameScene.loadState(currentState);

// Or save to storage
localStorage.setItem('gameState', JSON.stringify(currentState));

// Load from storage
const savedState = JSON.parse(localStorage.getItem('gameState'));
gameScene.loadState(savedState);
```

## 5. Implementation Steps

1. **Create GUIState interface** - Define the 7 card collections
2. **Create GUIStateManager class** - With capture and restore methods
3. **Add helper methods** - To extract cards from groups and recreate them
4. **Integrate with GameScene** - Add state manager property and methods
5. **Test** - Capture state, modify game, restore state

This is the absolute minimal approach - just 7 arrays of cards representing what's currently visible in each area of the game, with simple capture and restore functionality.