## GUI Implementation Tasks (Matching layout.jpeg)

### Phase 1: Overall Layout and Styling

- [x] **Task 1.1:** Adjust `styles.css` and `uioverlay.component.css` for full-screen overlay and background.
- [x] **Task 1.2:** Refine `table-renderer.ts` to use a felt texture (if available) or a more appropriate green color.
- [x] **Task 1.3:** Adjust camera position and rotation in `camera-controller.ts` for the exact perspective in `layout.jpeg`.
- [x] **Task 1.4:** Implement global font and text styling for UI elements to match `layout.jpeg`.

### Phase 2: Top Bar Elements

- [x] **Task 2.1:** Modify `score.component.ts` and `score.component.html` to display "Phase: Talon Open", "Game Points: Player 7 - Opponent 5", and "Trick Leader: Player" in the top bar.
- [x] **Task 2.2:** Position and style the top bar elements in `uioverlay.component.html` and `uioverlay.component.css`.

### Phase 3: Card Values Box (Top Left)

- [x] **Task 3.1:** Create a new component (e.g., `card-values-box.component.ts/html/css`) to display card values.
- [x] **Task 3.2:** Integrate and position `card-values-box.component` in `uioverlay.component.html` and `uioverlay.component.css`.

### Phase 4: Opponent Hand (Top Center)

- [x] **Task 4.1:** Modify `hand-renderer.ts` to render opponent cards with a question mark texture for face-down cards.
- [x] **Task 4.2:** Adjust opponent hand position in `three-js.component.ts` to match `layout.jpeg`.
- [x] **Task 4.3:** Modify `score.component.ts` and `score.component.html` to display "Opponent: ~25 pts" below the opponent hand.
- [x] **Task 4.4:** Position and style opponent score in `uioverlay.component.html` and `uioverlay.component.css`.

### Phase 5: Talon Stack (Mid-Left)

- [x] **Task 5.1:** Modify `talon-renderer.ts` to render the talon stack with a question mark texture on the top card.
- [x] **Task 5.2:** Adjust talon stack position in `three-js.component.ts` to match `layout.jpeg`.
- [ ] **Task 5.3:** Modify `talon.component.ts` and `talon.component.html` to display "7 cards left" text.
- [ ] **Task 5.4:** Position and style talon card count in `uioverlay.component.html` and `uioverlay.component.css`.

### Phase 6: Trump Card (Next to Talon)

- [ ] **Task 6.1:** Adjust trump card position in `talon-renderer.ts` to be partially underneath the talon stack.
- [ ] **Task 6.2:** Modify `talon.component.ts` and `talon.component.html` to display "TRUMP SUIT" text below the trump card.
- [ ] **Task 6.3:** Position and style trump suit text in `uioverlay.component.html` and `uioverlay.component.css`.

### Phase 7: Current Trick Area (Center)

- [ ] **Task 7.1:** Adjust trick area position in `three-js.component.ts` to match `layout.jpeg`.
- [ ] **Task 7.2:** Modify `trick-renderer.ts` to add a "LED" indicator for the first card played in the trick.
- [ ] **Task 7.3:** Position and style the "LED" indicator.

### Phase 8: Trick Piles (Right Side)

- [ ] **Task 8.1:** Create a new component (e.g., `trick-pile.component.ts/html/css`) to render stacked trick piles with counts.
- [ ] **Task 8.2:** Integrate and position player and opponent `trick-pile.component` in `three-js.component.ts` and `uioverlay.component.html/css`.
- [ ] **Task 8.3:** Modify `trick-pile.component.ts` and `trick-pile.component.html` to display "2 tricks" and "1 trick" text.
- [ ] **Task 8.4:** Position and style trick pile counts.

### Phase 9: Action Buttons (Bottom)

- [ ] **Task 9.1:** Refine styling of buttons in `action-buttons.component.css` to match `layout.jpeg`.
- [ ] **Task 9.2:** Add "Help" button to `action-buttons.component.html`.
- [ ] **Task 9.3:** Implement disabled states for buttons based on game logic (e.g., "Exchange Trump Jack" when not available).

### Phase 10: Message Area (Bottom)

- [ ] **Task 10.1:** Refine styling of the message area in `uioverlay.component.css` to match `layout.jpeg`.

### Phase 11: Visual States and Feedback

- [ ] **Task 11.1:** Implement visual feedback for playable cards (e.g., subtle glow/outline).
- [ ] **Task 11.2:** Implement clear selection indicator for selected card.
- [ ] **Task 11.3:** Implement visual feedback for invalid actions (e.g., red highlight/shake animation for illegal moves, grayed-out/disabled buttons).
- [ ] **Task 11.4:** Implement visual feedback for trick winner (brief highlight before collection).

### Phase 12: Responsive Design and Z-Index

- [ ] **Task 12.1:** Verify and adjust responsive layout for various screen sizes.
- [ ] **Task 12.2:** Ensure correct Z-index/layering for all 3D and UI elements.

### Phase 13: Final Polish

- [ ] **Task 13.1:** Adjust lighting for optimal visual appeal.
- [ ] **Task 13.2:** Implement any remaining minor visual adjustments to match `layout.jpeg`.