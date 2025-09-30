# Schnapsen Game Logic Implementation Plan

## Overview
This document outlines the step-by-step implementation plan for the Schnapsen game logic based on the rules defined in `rules.md` and `idea.md`. The current `game-logic.ts` file provides a basic structure but needs significant expansion to implement all game rules.

## Implementation Steps

### 1. Core Game State Management
- [ ] Implement current trick tracking (cards played, lead card, winner)
  - Add properties to track cards played in current trick
  - Implement logic to determine trick winner based on Schnapsen rules
- [ ] Implement player turn management
  - Add currentPlayer property to track whose turn it is
  - Implement turn switching logic after each trick
- [ ] Add game phase tracking (talon available vs. talon closed/exhausted)
  - Create enum for game phases: TALON_AVAILABLE, TALON_CLOSED, TALON_EXHAUSTED
  - Implement phase transition logic
- [ ] Implement trick counting for each player
  - Add trick counters for both players
  - Update counters when tricks are won
- [ ] Add card point tracking for each player's won tricks
  - Implement point calculation based on card values (A=11, 10=10, K=4, Q=3, J=2)
  - Add methods to calculate total points for each player

### 2. Card Management and Validity
- [ ] Implement card comparison logic (trump hierarchy, suit ranking)
  - Create isHigher(card1, card2, trumpSuit) function to compare cards
  - Implement trump checking logic
- [ ] Create functions to determine valid plays based on game phase
  - Implement isValidPlay(card, ledCard, playerHand, trumpSuit, gamePhase) function
  - Handle both Phase 1 (non-strict) and Phase 2 (strict) rules
- [ ] Implement card sorting for hand display
  - Enhance existing sortPlayerHand() with similar sorting for opponent hand
- [ ] Add card identification functions (isTrump, getCardValue, etc.)
  - isTrump(card, trumpSuit): boolean
  - getCardValue(card): number
  - isMarriage(component1, component2): boolean

### 3. Deal and Initialization
- [ ] Implement proper dealing sequence with turn-up trump
  - Enhance dealCards() to follow proper 3+2 distribution pattern
  - Ensure trump card is correctly positioned
- [ ] Add first dealer selection mechanism
  - Implement selectDealer() with proper randomization
- [ ] Implement dealer alternation after each hand
  - Add logic to switch dealer after each completed hand
- [ ] Create talon formation with face-down cards and visible trump
  - Ensure talon has 10 cards with visible trump on top

### 4. Trick-taking Logic (Phase 1 - Talon Available)
- [ ] Implement non-strict trick resolution (no follow suit requirement)
  - Create resolveTrick(ledCard, playedCard, trumpSuit) function
- [ ] Add talon drawing mechanics after each trick
  - Implement drawFromTalon() for winner then loser
  - Handle talon depletion (last 2 cards distribution)
- [ ] Implement trick winner determination
  - Enhance resolveTrick() to return winner of trick
- [ ] Add trick point accumulation
  - Update player points when tricks are won

### 5. Special Actions (Available in Phase 1)
- [ ] Implement Trump Jack exchange functionality
  - Add validation for exchange conditions (player holds trump jack, talon not closed)
  - Implement exchangeTrumpJack(playerHand, trumpCard) function
  - Handle card swap logic and update relevant state
- [ ] Implement Marriage declaration
  - Add validation (player has K+Q of same suit, has won at least 1 trick)
  - Implement declareMarriage(suit, isTrump) function
  - Track declared marriages separately from card points
  - Add marriage announcement ("20" or "40") to game state

### 6. Talon Closing Mechanism
- [ ] Implement talon closing action
  - Add validation (player's turn, 5 cards in hand, >2 cards in talon)
  - Implement closeTalon() function that flips trump card face-down
  - Handle closing state transition to Phase 2
- [ ] Add talon status tracking (open/closed/exhausted)
  - Enhance game phase tracking with talon status

### 7. Strict Trick-taking Logic (Phase 2 - Talon Closed/Exhausted)
- [ ] Implement follow suit requirements
  - Enhance isValidPlay() for Phase 2 with follow suit rules
- [ ] Add trumping rules enforcement
  - Implement trumping logic when unable to follow suit
- [ ] Implement "heading the trick" when possible
  - Add logic to check if higher card of suit can be played
- [ ] Handle case when talon is exhausted (last 2 cards distribution)
  - Implement special last trick distribution rule (winner gets face-down card, loser gets trump)
  - Transition to Phase 2 strict rules when talon is exhausted

### 8. Game Ending Conditions
- [ ] Implement "Going Out" mechanism
  - Add point calculation including marriages with calculateTotalPoints() function
  - Implement valid claim timing (after winning trick or declaring marriage)
  - Add claim validation (>=66 points) with validateClaim() function
- [ ] Implement scoring based on opponent's state at claim time
  - 1 point: opponent has ≥33 points
  - 2 points: opponent has <33 but won ≥1 trick (Schneider)
  - 3 points: opponent won no tricks (Schwarz)
- [ ] Implement false claim penalty
  - 2 points to opponent (3 if claim before opponent won any trick)
- [ ] Handle talon exhaustion case (winner of last trick wins hand)
  - Implement last trick winner determination
- [ ] Handle closed talon success/failure cases
  - Track opponent's state at time of closing for scoring
- [ ] Implement automatic win when closer loses last trick
  - Add logic to detect when closer loses last trick and award win to opponent

### 9. Match Scoring and Game End
- [ ] Implement game point tracking (starting from 7)
  - Enhance existing playerPoints$ and opponentPoints$ with game point tracking
- [ ] Add game point subtraction on hand wins
  - Implement updateGamePoints(winner, pointsWon) function
- [ ] Implement match win condition (first to ≤0 game points)
  - Add checkGameEnd() function to determine if match is over
- [ ] Add score verification mechanism
  - Implement verifyScores() to double-check point calculations

### 10. Edge Cases and Constraints
- [ ] Implement constraint: cannot close talon when only 2 cards remain
  - Add talon size check in closeTalon() function
- [ ] Implement constraint: cannot declare marriage until winning first trick
  - Add trick count validation in declareMarriage()
- [ ] Handle case when non-claimant has 66+ points but doesn't claim
  - Add logic in validateClaim() to ensure correct winner when claim is valid
- [ ] Implement proper card drawing order after tricks
  - Ensure winner draws first, then loser in drawFromTalon()
- [ ] Add validation for special actions timing (start of player's turn)
  - Add turn validation in exchangeTrumpJack() and declareMarriage()

## Implementation Approach
The recommended order rethinks the logical dependencies:

1. Start with core state management and card utilities (Steps 1-2)
2. Implement deal and initialization logic (Step 3)
3. Build trick-taking mechanics for Phase 1 (Step 4)
4. Implement card management and validity rules (Step 2 enhancements)
5. Add special actions (jack exchange, marriages) (Step 5)
6. Implement talon closing mechanism (Step 6)
7. Build Phase 2 strict trick-taking rules (Step 7)
8. Add game ending conditions and scoring (Step 8)
9. Implement complete match scoring (Step 9)
10. Handle edge cases and constraints (Step 10)
11. Test and refine all game flow transitions

## Validation Points
- [ ] Verify all card values match rules (A=11, 10=10, K=4, Q=3, J=2)
- [ ] Test trick resolution in both game phases
- [ ] Validate all special action conditions
- [ ] Confirm scoring calculations for all scenarios
- [ ] Test edge case constraints
- [ ] Validate game and match ending conditions