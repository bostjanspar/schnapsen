Three.js Schnapsen Game Layout Implementation Task
Overview
Create a 3D card game interface for Schnapsen using Three.js that displays a two-player game from one player's perspective. The layout should be functional, clean, and provide clear visual feedback for all game states.
ASCII Layout Reference
                    OPPONENT HAND (5 cards, face down)
                    [?] [?] [?] [?] [?]
                           ^
                    (opponent score display)

    TALON STACK        TRUMP CARD         OPPONENT TRICKS PILE
    [face-down]        [face-up]          [stacked cards]
    (10 cards)         (visible)          (won tricks)
        ^                  ^                    ^
    (cards remaining)   (suit/rank)        (tricks count)

                    CURRENT TRICK AREA
                    [card1] [card2] (if any)
                        ^      ^
                   (leader)  (follower)

         PLAYER TRICKS PILE                    PLAYER HAND
         [stacked cards]                   [A♠] [10♥] [K♦] [Q♣] [J♠]
              ^                               ^
         (tricks count)                   (5 cards, face up)
                                        (player score display)

                        GAME STATE DISPLAY
                    [Phase: Talon/Closed] [Game Points: P1-P2]
                    [Action Buttons/Messages]
Detailed Implementation Requirements
1. Camera and Scene Setup

Perspective: Top-down angled view (45-60 degrees) looking down at the table
Position: Camera positioned to show player's hand at bottom, opponent at top
Table Surface: Large green felt-textured plane as the playing surface
Lighting: Ambient lighting with directional light to create subtle shadows

2. Card Dimensions and Positioning

Card Size: Standard playing card proportions (2.5 x 3.5 units)
Card Thickness: 0.05 units for 3D effect
Spacing: 0.3 units between cards in hand, 0.1 units between stacked cards

3. Player Hand Layout (Bottom of Screen)

Position: Bottom center of screen, cards spread horizontally
Cards: 5 cards maximum, face-up, showing rank and suit
Hover Effect: Cards should be selectable/highlightable
Spacing: Cards slightly overlapping or evenly spaced depending on hand size
Player Score: Display current card points below hand (text overlay)

4. Opponent Hand Layout (Top of Screen)

Position: Top center of screen, mirroring player hand
Cards: 5 cards maximum, face-down (blue/red back pattern)
Representation: Uniform card backs, no rank/suit visible
Opponent Score: Display estimated/known points above hand

5. Talon Stack (Left Side)

Position: Center-left of playing area
Visual: Stack of face-down cards, slightly offset to show depth
Card Count: Visual indicator showing remaining cards (10 down to 0)
State: Must show when talon is closed (different visual state)

6. Trump Card (Center-Left)

Position: Next to talon stack, partially underneath
Visual: Face-up card showing trump suit and rank
Visibility: Always visible unless talon is closed
Exchange State: Visual indicator when trump Jack exchange is available

7. Current Trick Area (Center)

Position: Center of playing area
Capacity: 2 cards maximum (one from each player)
Layout: Cards placed side by side or slightly overlapping
Leader Indicator: Visual cue showing who led the trick
Clear State: Empty when trick is collected

8. Trick Piles (Left and Right Sides)

Player Tricks: Bottom-right area, stack of won cards
Opponent Tricks: Top-right area, stack of won cards
Visual: Small stacks showing card count, cards face-down
Count Display: Numerical indicator of tricks won
Point Display: Running total of card points in tricks

9. Game State Interface Elements

Phase Indicator: Text showing "Talon Phase" or "Closed Phase"
Game Points: Score display showing game points (start at 7 each)
Action Buttons: Context-sensitive buttons for:

"Close Talon" (when available)
"Exchange Trump Jack" (when available)
"Declare Marriage" (when available)
"Claim 66" (when available)


Message Area: Display current action prompts and game messages

10. Card Representation Requirements

Front Face: Clear rank and suit symbols (A, 10, K, Q, J)
Suit Colors: Red (hearts/diamonds), Black (spades/clubs)
Card Backs: Uniform pattern for face-down cards
Trump Highlighting: Visual distinction for trump suit cards
Marriage Pairs: Highlight matching K/Q pairs when available

11. Visual States and Feedback

Playable Cards: Highlight cards that can be legally played
Selected Card: Clear selection indicator
Invalid Actions: Visual feedback for illegal moves
Marriage Declaration: Highlight K/Q pairs when declaring
Trick Winner: Brief highlight of winning card before collection

12. Responsive Layout Considerations

Fixed Aspect Ratio: Maintain 16:9 or 4:3 aspect ratio
Scaling: All elements scale proportionally
Minimum Sizes: Ensure card details remain readable
Touch Targets: Adequate spacing for mobile interaction

13. Z-Index/Layering

Bottom Layer: Table surface
Card Layer: All cards at consistent height
Hover Layer: Selected/highlighted cards slightly elevated
UI Layer: Text overlays and buttons above cards
Modal Layer: Game messages and confirmations on top

14. Color Scheme and Theming

Table: Dark green felt texture
Cards: White/cream background with black/red symbols
UI Elements: Subtle transparency with good contrast
Highlights: Gold/yellow for selections, red for errors
Text: High contrast colors for readability

15. Interaction Areas

Player Hand: Each card clickable for selection/play
Action Buttons: Clearly defined clickable areas
Trump Card: Clickable for exchange action
Talon: Clickable for closing action
Trick Area: Visual feedback only, no interaction

16. Special Action Visual Cues

Trump Jack Exchange: Pulsing or glowing effect on trump card
Marriage Declaration: Highlight both K and Q simultaneously
Talon Closing: Visual transformation of talon stack
Going Out: Special effect when claiming 66 points

17. Technical Specifications

3D Models: Use PlaneGeometry for cards with appropriate materials
Textures: Card faces and backs as texture maps (card texture SVG files are in src/assets match file name with a card )
Materials: MeshLambertMaterial for good lighting response
Performance: Optimize for 60fps with reasonable polygon count
Memory: Efficient texture usage and geometry instancing

18. Error Handling Visual States

Invalid Card Play: Red highlight/shake animation
Illegal Actions: Grayed-out/disabled buttons
Game Rule Violations: Clear error messages
Connection Issues: Visual indicator for multiplayer

This implementation should create a clear, functional 3D interface that accurately represents all game states and provides intuitive interaction for Schnapsen gameplay.