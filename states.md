Create statet engine where each state has
OnEntry()
onLeave()
onEvent()
to move between state inside of state Transition(NEW_STATE) must be called
Each state can have sub-states: Before parent state OnEntry() is called sub-state  OnStartState and when paretn states is exited OnFinishState is moved , substate can have access to partet state via : parent


All States have access to Game-logic 
Schnapsen Game State Breakdown
Global States
PRE_GAME

onEntry: Display welcome message, prompt to start game

Events:

START_GAME → Transition to NEW_GAME

onExit: Initialize game settings

NEW_GAME

onEntry:

Set both players' game points to 7

Randomly assign first dealer

Transition: → HAND_SETUP

PLAY (Match in progress)

Substates: HAND_SETUP, HAND_PLAY, HAND_END

Exit Condition: Any player's game points ≤ 0 → DONE

DONE

onEntry: Declare winner, prompt to restart

Events:

RESTART → Transition to PRE_GAME

QUIT → Terminate

Substates (within PLAY)
I. HAND_SETUP

onEntry:

Shuffle 20-card deck (A/10/K/Q/J per suit)

Deal:

3 cards to each player (alternating)

Place next card face-up as trump indicator

Deal 2 more cards to each player

Stack remaining 9 cards face-down on trump card → Talon

Initialize hand state:

python
{
  "trump_suit": "<suit>",
  "talon": [<9 cards>],
  "phase": 1,  # 1=Talon available, 2=Strict rules
  "closed": False,
  "points": [0, 0],  # P1/P2 hand points
  "tricks_won": [0, 0],
  "pending_marriages": {0: [], 1: []}  # Unvalidated marriages
}
Transition: → HAND_PLAY (non-dealer starts)

II. HAND_PLAY
States:

TRICK_START

onEntry: Reset current trick, activate current player

Valid Actions (current player):

EXCHANGE_TRUMP_JACK: If:

Holds trump Jack

Talon not closed/exhausted

Before leading

Action: Swap Jack for face-up trump

DECLARE_MARRIAGE: If:

Holds K/Q of same suit

Has won ≥1 trick in hand

Before leading

Action: Add 20/40 points (if validated)

CLOSE_TALON: If:

Has 5 cards

Talon has ≥2 face-down cards (+trump)

Action: Flip trump face-down, set phase=2

LEAD_CARD: Play any card

TRICK_IN_PROGRESS

Event: PLAY_CARD by follower

Phase 1: Any card allowed

Phase 2: Enforce strict rules (follow suit/trump)

TRICK_END

Actions:

Determine winner (highest trump/suit)

Add trick points to winner's total

Validate pending marriages if winner won first trick

Draw from talon (if available):

Winner draws first

Loser draws second (takes face-up trump if talon empty)

If talon exhausted → phase=2

Hand End Conditions:

CLAIM_66 after winning trick → HAND_END

Last trick played (10th) → HAND_END

Else → TRICK_START (winner leads next)

III. HAND_END

onEntry:

If claim occurred:

Valid: Award game points based on opponent's state:

Opponent State	Game Points
≥33 points	1
<33 points, won ≥1 trick	2
Won 0 tricks	3
Invalid: Opponent gains 2-3 game points

No claim: Last trick winner gains 1 game point

Update match scores: player_score -= game_points_won

Transition:

If any player's score ≤0 → DONE

Else → HAND_SETUP (rotate dealer)

Key Rules Summary
Card Values: A=11, 10=10, K=4, Q=3, J=2

Marriages:

Declare at trick start after winning ≥1 trick

Royal (trump): 40 pts, Plain: 20 pts

Talon Closing:

Blocks draws, activates strict rules

Cannot close with only 2 cards in talon

Winning Conditions:

Claim 66 (after winning trick/marriage declaration)

Win last trick if no claim

Scoring:

Players start with 7 game points

Subtract won points; first to ≤0 wins match

This state machine enforces:

Turn order and valid actions per state

Phase-based trick rules

Point tracking and validation

Automatic state transitions after critical events