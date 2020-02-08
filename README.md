# @mytabworks/form-utils
It is a library of utilities which can help to front-end

- [Validator](#validator)
    - [Basic Usage](#validator-basic-usage)
    - [Extend Rules Usage](#validator-extend-rules-usage)
    - [Customize Rule Usage](#validator-customize-rule-usage)
    - [Collection Field Usage](#validator-collection-field-usage)
    - [Rules]
        - [Main](#validator-main-rules)
        - [Extensions](#validator-extension-rules)
    - [API]
        - [`instance.fails(): boolean`](#validator-collection-field-usage)
        - [`instance.errors(): Map`](#validator-collection-field-usage)
        - [`Validator.make(data: object, rules: object): instance`](#validator-collection-field-usage)
        - [`Validator.validate(recieved: string|array, rules: string, label: string): object`](#validator-basic-usage)
        - [`Validator.rulesExtend(rules: object): void`](#validator-extend-rules-usage)
- [DoneTypingEvent](#donetypingevent)
    - [Usage](#donetypingevent-basic-usage)
    - [API]
        - [`DoneTypingEvent(handler: function): object`](#donetypingevent-basic-usage)
  
## Validator
it is use to validate the user form fields, before it submiting into the server. the validation style is inspired by Laravel Validator.

### Validator Basic Usage
```js
import { Validator } from "@mytabworks/form-utils";

const result = Validator.validate("sample_sadas@", "required|email|min:10|max:20", "Email")
console.log(result) 
/*{ isInvalid: true, message: "The Email must be a valid email"}*/
```

### Validator Extend Rules Usage
To prevent Validator to be expensive in payload. it is decided to remove the rules that is not often to use and make them extendables</br>

`note! rules must be tight without spaces`</br>
`note! validator is reusable, when rules are extended, it only need to be extended once`
```js
import { Validator } from "@mytabworks/form-utils";
import { max_size, min_size } from "@mytabworks/form-utils/extend/rules";

Validator.rulesExtend({ max_size, min_size }) // extending max_size and min_size

const file = document.querySelector(`input[name="file"]`)
const received = file.files /*imagine files name is photo.jpeg and have 1000kb size*/
const rules = "required|max:2|mimes:jpeg,jpg|max_size:3000"
const label = file.name
const result = Validate.validate(received, rules, label)
console.log(result) 
/*{ isInvalid: false, message: null }*/ 
```


### Validator Customize Rule Usage
Validator rules is extandable which is custom rules are applicable.
```js
import { Validator } from "@mytabworks/form-utils";
import { required_if, same } from "@mytabworks/form-utils/extend/rules";

const strong_password = {
    regexp: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/g,
    exe(
        received, /*it is the value of the field it received*/
        first_param, /*rules:first_param*/
        second_param /*rules:first_param=second_param*/
    ) {
        /*first_param and second_param are not needed for this validation*/
        /*note! must return true when it is INVALID*/
        return !this.regexp.test(received)
    },
    message: "The :attribute must have 1 small letter, 1 capital letter, 1 number, and 1 special character"
    /*note! the :attribute is replace with the label of the form field you validate*/
    /*note! if you have first_param in your rules you must put the same name as your validation like :strong_password in the message*/
    /*note! if you have second_param you must put :third_party in the message*/
}

Validator.rulesExtend({ required_if, same, strong_password })

const pass = document.querySelector(`input[name="pass"]`)
const recieved = pass.value /*imagine value is Secretp@ssw0rd*/
const rules = "required|min:8|strong_password"
/*required
must have minimum of 8 characters 
customize strong_password*/

const label = "Password"
const result = validator.validate(received, rules, label)
console.log(result) /*it passed the rules so isInvalid will be false*/
/*result is { isInvalid: false, message: null }*/

const confirm = document.querySelector(`input[name="confirm"]`)
const c_recieved = confirm.value /*imagine value is "" */
const c_rules = "required_if:pass=.+|same:pass"
/*required_if - the [name="pass"] has a value of has content(.+)*/
/*same - value to the [name="pass"] */


const c_label = "Confirm"
const c_result = validator.validate(c_received, c_rules, c_label)
console.log(c_result)
/*{ isInvalid: true, message: "The Confirm field is required when pass is .+." }*/

/*To correct the message above, you must put a Alias(@) on the required_if "value" and "value of value"*/
const c_rules = "required_if:pass@Password=.+@contain value|same:pass@Password"
const c_result2 = validator.validate(c_received, c_rules, c_label)
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
|`NAME`       |`USE`                      |`DESCRIPTION`| `MESSAGE` |
|-------------|---------------------------|-------------|-------------|
| required    | required                  | it will require the form field to be filled| The :attribute field is required |
| email       | email                     | it will validate if the field contain a valid e-mail| The :attribute field must be valid email|
| min         | min:6                     | it will validate the minumum character, number, checkbox is checked, select(multiple) is selected, file(multiple) is selected | The :attribute field must be atleast :min (character, items, files) |
| max         | max:12                    | it will validate the maximum character, number, checkbox is checked, select(multiple) is selected, file(multiple) is selected | The :attribute field may not be greater than :max (character, items, files) |
| mimes       | mimes:jpeg,pdf,rar        | it will validate the specific mimes of the files which are allowed| The :attribute only allows :mimes|
| alpha       | alpha                     | it will validate if the field value is only contain letter | The :attribute may only contain letters|

## Validator Extension Rules
The extension rules that can be extended by importing [@mytabworks/form-utils/extend/rules](#validator-extend-rules-usage). these validation rules are excluded in the main rules because these are not often use in the form, so to reduce the payload mytabworks decided to remove these from the main list and became an extension when needed.
|`NAME`       |`USE`                        |`DESCRIPTION`| `MESSAGE` |
|-------------|---------------------------  |-------------|-------------|
| alpha_space | alpha_space       | it will validate if the field only contain letters with spaces | The :attribute must contain alphabet with spaces |
| alpha_num   | alpha_num                   | it will validate if the field contain letters with numbers| The :attribute may only contain letters and numbers.|
| alpha_dash  | alpha_dash                  | it will validate if the field contain letters with numbers and dashes | The :attribute may only contain letters, numbers, and dashes.|
| url         | url                         | it will validate if the field contain valid url | The :attribute must be a valid url. |
| max_size    | max_size:1000               | it will validate if the field contain a maximum file size and the size must calculate in kilobytes| The :attribute may not be greater :max_size kilobytes.|
| min_size    | min_size:1000               | it will validate if the field contain a minimum file size and the size must calculate in kilobytes| The :attribute must be atleast :min_size kilobytes.|
| required_if | required_if:target_field=target_expected_value | it will require the field, if the target field matches the expected value | The :attribute field is required when :required_if is :third_party. | 
| same        | same:target_field               | it will validate the field until the target field contain the same value | The :attribute and :same must match. |

## DoneTypingEvent
it is use to fire the event after user done typing, that will save a lot of unessesary execution while typing, especially in React when using state

### DoneTypingEvent Basic Usage
```js 
import { DoneTypingEvent } from "@mytabworks/form-utils";

const typing = DoneTypingEvent(event => {
    /*triggered when done typing*/
    const value = event.target.value
}, 500) /*miliseconds to wait every enrty before it fire*/

export const Input () => (
    <input type="text" {...typing}>
)
```


## Jest Test issue?

jest test SyntaxError: unexpected token export? no problem!

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