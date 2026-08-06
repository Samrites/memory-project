# Corrections based on the Memory feedback

## Settings
- Removed the separate "Choose a theme to see the preview" placeholder screen.
- The Code Vibes preview is visible immediately without preselecting a radio option.
- Theme previews change only after a theme is selected, not merely by hovering.
- Theme, player and board size still start unselected.
- The Start button remains disabled until all three settings have been selected.
- The summary starts with `Game theme / Player / Board size` and updates after clicks.
- The summary is display-only; hovering or clicking it does not change settings.
- Selected choices use the filled radio dot, bold text and yellow arrow marker.

## Code quality
- Settings are imported directly from the page module; there is no redundant re-export file.
- The project uses npm only and keeps a small `.gitignore`.
- The application uses typed settings and a `MemoryCard` class.

## Git
Git history was intentionally not modified. Continue in the existing repository and commit the corrections in small, understandable steps.
