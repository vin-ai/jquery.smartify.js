# Contributing

## Important notes
Please don't edit files in the `dist` subdirectory as they are generated via Grunt. You'll find source code in the `src` subdirectory!

### Code style
Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

### PhantomJS
While Grunt can run the included unit tests via [PhantomJS](http://phantomjs.org/), this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

## Modifying the code
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

Test that Grunt's CLI is installed by running `grunt --version`.  If the command isn't found, run `npm install -g grunt-cli`.  For more information about installing Grunt, see the [getting started guide](http://gruntjs.com/getting-started).

1. Fork and clone the repo.
1. Run `npm install` to install all dependencies (including Grunt).
1. Run `grunt` to grunt this project.

Assuming that you don't see any red, you're ready to go. Just be sure to run `grunt` after making any changes, to ensure that nothing is broken.

## Submitting pull requests

1. Create a new branch, please don't work in your `master` branch directly.
1. Add failing tests for the change you want to make. Run `grunt` to see the tests fail.
1. Fix stuff.
1. Run `grunt` to see if the tests pass. Repeat steps 2-4 until done.
1. Open `test/*.html` unit test file(s) in actual browser to ensure tests pass everywhere.
1. Update the documentation to reflect any changes.
1. Push to your fork and submit a pull request.


## Only one feature or change per pull request

Make pull requests only one feature or change at the time. 
For example you have fixed a bug. You also have optimized 
some code. Optimization is not related to a bug. These should 
be submitted as separate pull requests. This way I can easily 
choose what to include. It is also easier to understand the 
code changes. Commit messages should be descriptive and full 
sentences.

Do not commit minified versions. Do not touch the version number. 
Make the pull requests against [WIP branch](https://github.com/vinaykrsharma/jquery.smartify/commits/WIP).

## Write meaningful commit messages

Proper commit message is full sentence. It starts with capital 
letter but does not end with period. Headlines do not end with 
period. The GitHub default `Update filename.js` is not enough. 
When needed include also longer explanation what the commit does.

```
Capitalized, short (50 chars or less) summary

More detailed explanatory text, if necessary.  Wrap it to about 72
characters or so.  In some contexts, the first line is treated as the
subject of an email and the rest of the text as the body.  The blank
line separating the summary from the body is critical (unless you omit
the body entirely); tools like rebase can get confused if you run the
two together.
```

When in doubt see Tim Pope's blogpost [A Note About Git Commit Messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

## Follow the existing coding standards

When contributing to open source project it is polite to follow 
the original authors coding standards. They might be different 
than yours. It is not a world war. Just follow then original.

```javascript
var snake_case = "something";

function not_camel_case(options) {
    //
}

if (true !== false) {
    console.log("Here be dragons!");
}
```
