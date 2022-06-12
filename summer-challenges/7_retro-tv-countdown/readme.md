# Retro TV Countdown

Countdown clock is based on [ITV Schools and Colleges Countdown - Late 1970s](https://www.youtube.com/watch?v=9ygdAlbdcCs) and is can be found [here](./index.html).

## Customisation

The `<retro-countdown>` element has many customisable properties.

- `blur` (Defaults to 1.25) is the value applied to the canvases' CSS `blur()` filter in px.
- `diameter` (Defaults to 400) is the diameter of the outer edge of the countdown ring in px.
- `fade-from` (Defaults to 0.9) signifies at what point the music should start fading out.
- `fontsize` (Defaults to 48) is the font size in px of the text.
- `fps` (Defaults to 20) is the frames per second for the countdown animation.
- `seconds` (Defaults to 60) is the length in seconds that the countdown will take.
- `size` (Defaults to 500) is the size of the canvas width and height in px.
- `text` (Defaults to "Hello\nWorld!") is the text content to be displayed in the countdown. New lines should be separated using `\n`.
  - (0.0 will begin fading immediately, 0.5 will fade half way through, and 1.0 will not fade at all)

## Known issues

- When inputting the `text` field in HTML, `\n` is not recognised as a new line character and so the text cannot be split into an array in JS using `text.split('\n')`. To counter this, the array is split using `text.split('\\n')` which works as the first `\` is used as an escape character, however when inputting the `text` field using some JS script, `\\n` will have to be used to signify line breaks.
  - HTML `"Hello\nWorld!"` = JS `"Hello\\nWorld!"`

## Future ideas

- Add custom audio. Currently the countdown will use `./chateux.mp3` only. If taking this idea further, a custom audio file could be uploaded and fed into the `<audio>` element.
- Adding the ability to change colours. Take a break from the white on blue and allow for custom colouring.
