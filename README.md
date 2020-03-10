# mytabworks-utils
It is a library of utilities which can help the front-end dev.

- [Validator](#validator)
    - [Basic Usage](#validator-basic-usage)
    - [Extend Rules Usage](#validator-extend-rules-usage)
    - [Customize Rule Usage](#validator-customize-rule-usage)
    - [Collection Field Usage](#validator-collection-field-usage)
    - [Rules]
        - [Main](#validator-main-rules)
        - [Extensions](#validator-extension-rules)
    - [API]
        - [instance.fails(): boolean](#validator-collection-field-usage)
        - [instance.errors(): Map](#validator-collection-field-usage)
        - [Validator.make(data: object, rules: object): instance](#validator-collection-field-usage)
        - [Validator.validate(recieved: string|array, rules: string, label: string): object](#validator-basic-usage)
        - [Validator.rulesExtend(rules: object): void](#validator-extend-rules-usage)
- [DoneTypingEvent](#donetypingevent)
    - [Usage](#donetypingevent-basic-usage)
    - [API]
        - [`DoneTypingEvent(handler: function): object`](#donetypingevent-basic-usage)
- [License](#license)
  
## Validator
it is a core validator tool that is use to validate the user form fields, before submiting into the server. the validation style is inspired by Laravel Validator.

### Validator Basic Usage
```js
import { Validator } from "mytabworks-utils";

const result = Validator.validate("sample_sadas@", "required|email|min:10|max:20", "Email")
console.log(result) 
/*{ isInvalid: true, message: "The Email must be a valid email"}*/
```

### Validator Extend Rules Usage
`Validator` has two section of rules the [main rules](https://github.com/mytabworks/mytabworks-utils#validator-main-rules) which are the commonly use rules and the [extend rules](https://github.com/mytabworks/mytabworks-utils#validator-extension-rules) which are the extensible and the "not" commonly use rules. The reason why it is seperated, is to reduce the payload of an unuse rules.</br>

note! rules must be tight without spaces and validator is reusable, when rules are extended, it only need to be extended once</br>

```js
import { Validator } from "mytabworks-utils";
import { max_size, min_size } from "mytabworks-utils/extend/rules";

Validator.rulesExtend({ max_size, min_size }) // extending max_size and min_size

const profile_p = document.querySelector(`input[name="profile_p"]`)
const received = profile_p.files /*imagine files name is photo.jpeg and have 1000kb size*/
const rules = "required|max:2|mimes:jpeg,jpg|min_size:1000|max_size:3000"
const label = "Profile photo"
const result = Validate.validate(received, rules, label)
console.log(result) 
/*{ isInvalid: false, message: null }*/ 
```


### Validator Customize Rule Usage
Validator rules is extensible which is custom rules are applicable.
```js
import { Validator } from "mytabworks-utils";
import { required_if, same } from "mytabworks-utils/extend/rules";

const strong_password = {
    regexp: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/g,
    exe(received, first_param, second_param ) {
        /*
        recieved - it is the received value of the field
        first_param - rules:<first_param> it is use when custom rules have first parameter like min, max, mimes, etc.
        second_param - rules:<first_param>=<second_param> it is use when custom rules have first and second parameter like required_if.
        */

        /*first_param and second_param are not needed for this validation*/
        /*note! must return true when it is INVALID*/
        return !this.regexp.test(received)
    },
    message: "The :attribute must have 1 small letter, 1 capital letter, 1 number, and 1 special character"
    /*note! in messages
        the :attribute is replace by the label inputed.
        the name of rule like :strong_password can be use to replace by first_param inputed
        the :third_party is replace by the second_param 
    */
}

Validator.rulesExtend({ required_if, same, strong_password })

const pass = document.querySelector(`input[name="pass"]`)
const received = pass.value /*imagine value is Secretpssrd*/
const rules = "required|min:8|strong_password"

const label = "Password"
const result = validator.validate(received, rules, label)
console.log(result) 
/*{ isInvalid: false, message: "The Password must have 1 small letter, 1 capital letter, 1 number, and 1 special character" }*/

const confirm = document.querySelector(`input[name="confirm"]`)
const c_received = confirm.value /*imagine value is "" */
const c_rules = "required_if:pass=.+|same:pass"

const c_label = "Confirm"
const c_result = validator.validate(c_received, c_rules, c_label)
console.log(c_result)
/*{ isInvalid: true, message: "The Confirm field is required when pass is .+." }*/

/*To correct the message above, you must put a Alias(@) on the required_if "value" and "value of value".
since most of the time field names are not the same as the labels and same with the values label. that is why you can use Aliasing(@)*/
const aliased_rules = "required_if:pass@Password=.+@contain value|same:pass@Password"
const c_result2 = validator.validate(c_received, aliased_rules, c_label)
console.log(c_result2)
/*{ isInvalid: true, message: "The Confirm field is required when Password is contain value." }*/
```

## Validator Collection Field Usage
it can validate collections of form fields.
```js
const forms = {
    first_name: "john",
    last_name: "doe",
    email: "johndoe@gmail",
    web: "mytabworks.com",
    items: ["90293", "23223", "23232"]
}

const rules = {
    first_name: { 
        label: "First Name", 
        rules: "required|alpha" 
    },
    last_name: { 
        label: "Last Name", 
        rules: "required|alpha|min:3" 
    },
    email: { 
        label: "E-mail", 
        rules: "required|email"
    },
    web: { 
        label: "Website", 
        rules: "url"
    }
}

const validator = Validator.make(forms, rules)

if(validator.fails()) {

    const message = validator.errors()
 
    document.getElementById("first_name_error").textContent =  message.has("first_name") ? message.get("first_name") : ""
    document.getElementById("last_name_error").textContent = message.has("last_name") ? message.get("last_name") : ""
    document.getElementById("email_error").textContent = message.has("email") ? message.get("email") : ""
    document.getElementById("web_error").textContent = message.has("web") ? message.get("web") : ""

    //OR
    let collect = "<ul>"
    message.forEach((message, name) => {
        // do something
        collect += `<li>${message}</li>`
    })
    collect += "</ul>"

    document.getElementById("errors").innerHTML = collect
}

```

## Validator Main Rules
The main validation rules which is commonly use.
|NAME           |HOW TO USE                      |DESCRIPTION| MESSAGE |
|-------------|---------------------------|-------------|-------------|
| required    | required                  | it will require the form field to be filled| The :attribute field is required |
| email       | email                     | it will validate if the field contain a valid e-mail| The :attribute field must be valid email|
| min         | min:<number>              | it will validate the minumum character, number, checkbox is checked, select(multiple) is selected, file(multiple) is selected. `ex. min:10` | The :attribute field must be atleast :min (character, items, files) |
| max         | max:<number>              | it will validate the maximum character, number, checkbox is checked, select(multiple) is selected, file(multiple) is selected. `ex. max:20` | The :attribute field may not be greater than :max (character, items, files) |
| mimes       | mimes:<mime_types>        | it will validate the specific mimes of the files which are allowed. `ex. mimes:jpg,pdf,rar`| The :attribute only allows :mimes|
| alpha       | alpha                     | it will validate if the field value is only contain letter | The :attribute may only contain letters|

## Validator Extension Rules
The extension rules can only be use by extending and importing [`mytabworks-utils/extend/rules`](#validator-extend-rules-usage). these validation rules are excluded in the main rules because these are not often use in the form, so to reduce the payload mytabworks decided to remove these from the main list and became an extension when needed.
|NAME       |HOW TO USE                        |DESCRIPTION| MESSAGE |
|-------------|---------------------------  |-------------|-------------|
| alpha_space | alpha_space       | it will validate if the field only contain letters with spaces | The :attribute must contain alphabet with spaces |
| alpha_num   | alpha_num                   | it will validate if the field contain letters with numbers| The :attribute may only contain letters and numbers.|
| alpha_dash  | alpha_dash                  | it will validate if the field contain letters with numbers and dashes | The :attribute may only contain letters, numbers, and dashes.|
| url         | url                         | it will validate if the field contain valid url | The :attribute must be a valid url. |
| max_size    | max_size:<number>           | it will validate if the field contain a maximum file size and the size must calculate in kilobytes. `ex. max_size:5000`| The :attribute may not be greater :max_size kilobytes.|
| min_size    | min_size:<number>           | it will validate if the field contain a minimum file size and the size must calculate in kilobytes. `ex. min_size:1000`| The :attribute must be atleast :min_size kilobytes.|
| required_if | required_if:<target_field_name>=<target_expected_value> | it will require the field, if the target field matches the expected value. you can use exact value or regular expression like `required_if:bio=.+`. `.+` means has any value. `ex. required_if:country=AU` since most of the time field names are not the same as the labels and same with the values label. that is why you can use Aliasing(@) `ex. required_if:country@Country=AU@Australia`  | The :attribute field is required when :required_if is :third_party. | 
| same        | same:<target_field_name>               | it will validate the field until the target field contain the same value. `ex. same:pass` since most of the time field names are not the same as the labels you can use Aliasing(@) `ex. same:pass@Password` | The :attribute and :same must match. |

## DoneTypingEvent
it is use to fire the event after user done typing, that will save a lot of unessesary execution while typing, especially in React when using state

### DoneTypingEvent Basic Usage
```js 
import React from "react";
import { DoneTypingEvent } from "mytabworks-utils"; 

export const Input () => { 
    const handleDoneTyping = DoneTypingEvent(event => {
        /*triggered when done typing*/
        const value = event.target.value
    }, 500) /*miliseconds to wait every enrty before it fire*/

    return (
        <input type="text" {...handleDoneTyping}>
    )
}
```


### Jest Test issue?
This is already fixed here in `mytabworks-utlis` but it is kept in case same problem are occured in other library.

jest test SyntaxError: unexpected token export

### First solution
Add to your jest configuration the transformIgnorePatterns containing /node_modules/(?!(?:--repo-making-issue--))

```js
"transformIgnorePatterns": [
    "/node_modules/(?!(?:mytabwork-utils))"
]
```

### Second solution

#### First step
You need to change .babelsrc to babel.config.js. in case you dont have .babelsrc you can create babel.config.js,
and copy your babel configuration in package.json then paste it in your babel.config.js. like below

```js
module.exports = {
    "presets": [
        "react-app"
      ]
}
```

#### Second step
on package.json script test put the --transformIgnorePatterns '/node_modules/(?!(?:--repo-making-issue--))' after test.

```js
"scripts": {
    "test": "react-app test --transformIgnorePatterns '/node_modules/(?!(?:mytabwork-utils))'"
}
``` 

it will work like a charm (^_^)y

### License
MIT Licensed. Copyright (c) fernandto tabamo jr (Mytabworks) 2020.