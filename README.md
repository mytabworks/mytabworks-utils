# mytabworks-utils
It is a small function of utilities that is build from the ground up

## Validator
it is use to validate the user inputs, before it will submit into the server

### Validator Basic Usage
```js
    import { Validator } from "mytabworks-utils";

    const validator = new Validator()
    const email = document.getElementById("email") 
    const received = email.value // "sample@"
    const validations = "required|email|min:10|max:20" //
    const label = email.name // Email
    const email_result = validator.validate(received, validations, label)
    console.log(email_result) 
    // { isInvalid: true, message: "The Email must be a valid email"}
```

### Validator extend validations
To prevent Validator to be expensive in payload. It is decided to include only the common validation like required|email|min:number|max:number|mimes:string</br>

`note! validations must be tight without spaces`
`note! validator is reusable, when you extending validations you only need to extend it once`
```js
    import { Validator } from "mytabworks-utils";
    import { 
        max_size, 
        min_size, 
        required_if, 
        same, 
        alpha_dash, 
        alpha_space, 
        alpha_num, 
        url 
    } from "mytabworks-utils/extend/validator";
    
    Validator.extend({ max_size, min_size })

    const validator = new Validator()
    const file = document.querySelector(`input[name="file"]`)
    const received = file.files /*imagine files name is photo.jpeg*/
    const validations = "required|max:2|mimes:jpeg,jpg|max_size:3000"
    const label = file.name // file
    const file_result = validator.validate(received, validations, label)
    console.log(file_result) 
    //{ isInvalid: false }
```
### Validator Customize validation
It can extend customize validation.
```js
    import { Validator } from "mytabworks-utils";
    import {  
        required_if, 
        same
    } from "mytabworks-utils/extend/validator";

    const strong_password = {
        regexp: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/g,
        exe(
            received, /*it is the value of the input you put*/
            value, /*required_if:value*/ /*it is the value of the validations like in the front line*/
            value_of_value /*required_if:value=value_of_value*/ /*it is the value-of-value of the validations like in the front line*/
        ) {
            /*we don't need value and value_of_value for these*/
            /*must return true when received is invalid*/
            return !this.regexp.test(received)
        },
        message: "The :attribute must have 1 small letter, 1 capital letter, 1 number, and 1 special character"
        /*note! the :attribute is replace with the label of the form field you validate*/
        /*note! if you require value in your validations you must put the same name as your validation like :strong_password in the message*/
        /*note! if you require value-of-value you must put :third_party in the message*/
    }

    Validator.extend({ required_if, same, strong_password })

    const validator = new Validator()
    const pass = document.querySelector(`input[name="pass"]`)
    const p_recieved = pass.value /*imagine value is Secretp@ssw0rd*/
    const p_validations = "required|min:8|strong_password"
    /*required
    must have minimum of 8 characters 
    customize strong_password*/
    
    const p_label = "Password"
    const p_result = validator.validate(p_received, p_validations, p_label)
    console.log(p_result) /*it passed the validations so isInvalid will be false*/
    /*p_result is { isInvalid: false }*/

    const confirm = document.querySelector(`input[name="confirm"]`)
    const c_recieved = confirm.value /*imagine value is ""*/
    const c_validations = "required_if:pass=.+|same:pass@Password"
    /*required_if the [name="pass"] has a value of anything(.+)*/
    /*same value to the [name="pass"] with alias(@) of Password*/
    /*note! Alias(@) is for the real label of the [name="pass"] because sometimes input name and label are not the same*/
    
    const c_label = "Confirm"
    const c_result = validator.validate(c_received, c_validations, c_label)
    console.log(c_result)
    /*{ isInvalid: true, message: "The Confirm field is required when pass is .+." }*/

    /*To correct the message above, you must put a Alias(@) on the required_if "value" and "value of value"*/
    const c_validations = "required_if:pass@Password=.+@contain value|same:pass@Password"
    const c_result2 = validator.validate(c_received, c_validations, c_label)
    console.log(c_result2)
    /*{ isInvalid: true, message: "The Confirm field is required when Password is contain value." }*/
```

## Validator default validations

|`NAME`       |`USE`                      |`DESCRIPTION`| `MESSAGE` |
|-------------|---------------------------|-------------|-------------|
| required    | required\|email  | it will require the form field to be filled| The :attribute field is required |
| email       | email                     | it will validate if the field contain a valid e-mail| The :attribute field must be valid email|
| min         | min:6                     | it will validate the minumum character, number, checkbox is checked, select(multiple) is selected, file(multiple) is selected | The :attribute field must be atleast :min (character, items, files) |
| max         | max:12                    | it will validate the maximum character, number, checkbox is checked, select(multiple) is selected, file(multiple) is selected | The :attribute field may not be greater than :max (character, items, files) |
| mimes       | mimes:jpeg,pdf,rar        | it will validate the specific mimes of the files which are allowed| The :attribute only allows :mimes|
| alpha       | alpha                     | it will validate if the field value is only contain letter | The :attribute may only contain letters|

## Validator extensions validations

|`NAME`       |`USE`                        |`DESCRIPTION`| `MESSAGE` |
|-------------|---------------------------  |-------------|-------------|
| alpha_space | required\|alpha_space       | it will validate if the field only contain letters with spaces | The :attribute must contain alphabet with spaces |
| alpha_num   | alpha_num                   | it will validate if the field contain letters with numbers| The :attribute may only contain letters and numbers.|
| alpha_dash  | alpha_dash                  | it will validate if the field contain letters with numbers and dashes | The :attribute may only contain letters, numbers, and dashes.|
| url         | url                         | it will validate if the field contain valid url | The :attribute must be a valid url. |
| max_size    | max_size:1000               | it will validate if the field contain a maximum file size and the size must calculate in kilobytes| The :attribute may not be greater :max_size kilobytes.|
| min_size    | min_size:1000               | it will validate if the field contain a minimum file size and the size must calculate in kilobytes| The :attribute must be atleast :min_size kilobytes.|
| required_ifn| required_if:level=1         | it will require the field if a certain field matches the value of the declared | The :attribute field is required when :required_if is :third_party. | 
| same        | same:password               | it will validate if the field contain the same value | The :attribute and :same must match. |

## DoneTypingEvent
it is use to fire the event after user done typing, that will save a lot of unessesary execution while typing, especially in React when using state

### DoneTypingEvent Basic Usage
```js 
    import { DoneTypingEvent } from "mytabworks-utils";

    const typing = DoneTypingEvent(event => {
        //triggered when done typing
        const value = event.target.value
    }, 500) // miliseconds to wait every enrty before it fire
    
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

### First step
You need to change .babelsrc to babel.config.js. in case you dont have .babelsrc you can create babel.config.js,
and copy your babel configuration in package.json then paste it in your babel.config.js. like below

```js
module.exports = {
    "presets": [
        "react-app"
      ]
}
```

### Second step
on package.json script test put the --transformIgnorePatterns '/node_modules/(?!(?:--repo-making-issue--))' after test.

```js
"scripts": {
    "test": "react-app test --transformIgnorePatterns '/node_modules/(?!(?:mytabwork-utils))'"
}
``` 

it will work like a charm (^_^)y

### License
MIT Licensed. Copyright (c) Mytabworks 2020.