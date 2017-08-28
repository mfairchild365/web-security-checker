# SecurityCheck.js

This is a quick webpage security checker based on headless-chrome. It will check a given page for various security problems are report any issues that were found via JSON output.

This is a prototype.

## Checks performed

* HTTPS certificate issues
* mixed-content issues

## Install

```
npm install
```

## running

```
node check.js {absolute URL to test}
```
