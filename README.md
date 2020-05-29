# gatsby-plugin-wav-multiformat

This plugin simply takes all wav file nodes created by `gatsby-source-filesystem` and adds mp4 (aac), ogg (vobis) and flac versions of these files in the same static folder as the original file. You can therefore after querying the wav file rewrite this:

```jsx
const MyAudioComponent = ({ src }) => {
  return (
    <audio controls>
      <source src={src} type="audio/wav" />
      Your browser does not support the <code>audio</code> element.
    </audio>
  )
}
```

to this

```jsx
const re = /\.wav$/

const MyAudioComponent = ({ src }) => {
  return (
    <audio controls>
      <source src={src.replace(re, '.m4a')} type="audio/mp4"/>
      <source src={src.replace(re, '.ogg')} type="audio/ogg; codecs=vorbis"/>
      <source src={src.replace(re, '.flac')} type="audio/flac	"/>
      <source src={src} type="audio/wav" />
      Your browser does not support the <code>audio</code> element.
    </audio>
  )
}
```

## Prerequisites

This plugin uses ffmpeg ans sox to convert to the different file formats. Here are some examples how you could install these on different plattforms

**MacOS (Homebrew)**

```sh
brew install sox ffmpeg
```

**Ubuntu**

```sh
apt install sox ffmpeg
```

## Usage

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `audio`,
        path: `${__dirname}/src/audio/`,
        ignore: [`**/\.*`], // ignore files starting with a dot
      },
    },
    `gatsby-plugin-wav-multiformat`,
  ],
};
```

Also if you already had wav files included in your site don't forget to clear the cache (`gatsby clean`) for once.
