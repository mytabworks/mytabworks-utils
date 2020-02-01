# mytabworks-utils
It is a small function of utilities that is build from the ground up

## Validator
it is use to validate the user inputs, before it will submit into the server

### Validator Basic Usage
```js
    const validator = new Validator()
    const email = document.getElementById("email") 
    const received = email.value // "sample@"
    const validations = "required|email"
    const label = email.name // Email
    const email_result = validator.validate(received, validations, label)
    console.log(email_result) 
    // { isInvalid: true, message: "The Email must be a valid email"}
```

## DoneTypingEvent
it is use to fire the event after user done typing, that will save a lot of unessesary execution wil typing, especially in React when using state

### DoneTypingEvent Basic Usage
```js 
    const typing = DoneTypingEvent(event => {
        //triggered when done typing
        const value = event.target.value
    }, 500) // miliseconds
    
    <input type="text" {...typing}>
```


# Jest Test issue?

jest test SyntaxError: unexpected token export? no problem!

## First solution
Add to your jest configuration the transformIgnorePatterns containing /node_modules/(?!(?:mytabwork-utils))

```js
"transformIgnorePatterns": [
    "/node_modules/(?!(?:mytabwork-utils))"
]
```

## Second solution

### first step
You need to change .babelsrc to babel.config.js. in case you dont have .babelsrc you can create babel.config.js,
and copy your babel configuration in package.json then paste it in your babel.config.js. like below

```js
module.exports = {
    "presets": [
        "react-app"
      ]
}
```

#### second step
on package.json script test put the --transformIgnorePatterns '/node_modules/(?!(?:--repo-making-issue--))' after test.

```js
"scripts": {
    "test": "react-app test --transformIgnorePatterns '/node_modules/(?!(?:mytabwork-utils))'"
}
``` 

it will work like a charm (^_^)y

### License
MIT Licensed. Copyright (c) Mytabworks 2020.