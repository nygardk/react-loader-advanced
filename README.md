# react-loader-advanced

> Show loader overlaying your component during async events.

React-loader-advanced provides a component into which you can wrap
an arbitrary React component. The loader will fill the area of the component
and display a loading message. You may need multiple loader containers
at different parts of your page. This loader also supports setting priority
for the loaders so that the lower priority loaders will never show if
there is another loader already showing. This is beneficial when you want to
prevent transparent loaders overlapping, which would look ugly.

<img src="gifs/loader-example.gif" alt="Loader example" style="width: 340px;"/>

## Install

```shell
npm install react-loader-advanced --save
```

## Usage

__1. Include Loader__

Node:
```js
import Loader from 'react-loader-advanced';
```

__2. Wrap your component inside the loader__
```jsx
<Loader show={true} message={'loading'}>
  <SomeComponent />
</Loader>
```
__3. Style the loader using foregroundStyle and backgroundStyle__

You may disable all default styling by setting property
*defaultStyle* as `false`.

```jsx
<Loader defaultStyle={false}
  foregroundStyle={{color: 'white'}}
  backgroundStyle={{backgroundColor: 'black'}}>
...
```

__4. Optionally if you wish, hack the loader using CSS styles
knowing the class-hierarchy__

```html
<div class="Loader--background">
  <div class="Loader--foreground">
    <div class="Loader--message">
      Loading
    </div>
  </div>
</div>
```

See more thorough structure in `./src/react-loader-advanced.jsx`.

## Options (props)

__show__ (bool)
This is the only required prop.
When _true_, loader overlay is displayed.
When _false_, only actual content is displayed.

__priority__ (int)
The loader(s) with the highest priority will always be the only loader(s)
showing. If loaders with lower priorities stop loading before the one with
the highest priority, they will never be shown.
Default priority is 0.

__hideContentOnLoad__ (bool)
Hide content underneath loader overlay when loading.

__backgroundBlur__ (int = px)
Blur the background on browsers that support CSS filter().

__message__ (node = element|string)
Set the displayed message on foreground while loading.
Can be an arbitrary element or just a simple string.
Defaults to "loading...".

__foregroundStyle__ (obj)
Set a style for the loader foreground.
Extends default styles.

__backgroundStyle__ (obj)
Set a style for the loader background.
Extends default styles.

__disableDefaultStyles__ (bool)
Disables all default styles if set to _true_ (not recommended).

## License

MIT