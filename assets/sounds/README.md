# Sound Effects for Vero App

This directory contains sound effects for the task completion feature.

## Required Sound Files

To enable sound effects, add the following files to this directory:

1. **success.mp3** - Played when marking a task as complete
   - Recommended: Short, positive sound (0.5-1 second)
   - Format: MP3
   - Example: A pleasant "ding" or "chime" sound

2. **uncheck.mp3** - Played when unchecking a task
   - Recommended: Short, neutral sound (0.5-1 second)
   - Format: MP3
   - Example: A soft "click" or "pop" sound

## Where to Find Sound Files

You can find free sound effects from:
- [Freesound.org](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [SoundBible](http://soundbible.com/)
- [OpenGameArt](https://opengameart.org/)

## File Requirements

- **Format**: MP3
- **Duration**: 0.5-2 seconds (short sounds work best)
- **Quality**: 44.1kHz, 128kbps or higher
- **Size**: Keep under 100KB per file for optimal performance

## Testing

After adding the sound files:
1. Restart the Expo development server
2. Test by checking/unchecking subgoals
3. Use the volume button to toggle sound on/off

## Troubleshooting

If sounds don't play:
1. Check that file names match exactly: `success.mp3` and `uncheck.mp3`
2. Ensure files are valid MP3 format
3. Check console logs for error messages
4. Verify sound is enabled in the app (volume icon should be green) 