## 1.3.0 (May 7, 2016)

* Removed babel-polyfill that was polluting globals. Now using
babel-transform-runtime instead.

* Internal changes.

## 1.1.1 (Mar 8, 2016)

Very important bugfix: rendering was causing redundant mounts and
unmounts that caused unwanted side-effects on rare cases.

## 0.7.0 (Oct 23, 2015)

### Breaking changes

CSS styles now follow correct BEM-naming. Update your classes if you have
overriden Loader classes.

* Loader--content => Loader__content
* Loader--background => Loader__background
* Loader--foreground => Loader__foreground
* Loader--message => Loader__message
