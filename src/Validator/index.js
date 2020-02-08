( function( global, factory ) {


	if ( typeof module === "object" && typeof module.exports === "object" ) {
    
		module.exports = factory( global )
      
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window ) { 
  
  const validationlist = {

    alpha: {
      regexp: /^[A-Za-z]+$/,
      message: 'The :attribute may only contain letters.',
      exe(received) {
        return received.length && !this.regexp.test(received)
      }
    },

    email: {
      regexp: /^[\w.]{2,40}@[\w]{2,20}\.[a-z]{2,3}(?:\.[a-z]{2})?$/,
      message: 'The :attribute must be a valid email.',
      exe(received) {
        return received.length && !this.regexp.test(received)
      }
    },

    max: {
      message: {
        numeric: 'The :attribute may not be greater than :max.',
        file: 'The :attribute may not be greater than :max files.',
        string: 'The :attribute may not be greater than :max characters.',
        array: 'The :attribute may not be greater than :max items.',
      },
      exe(received, max) {
        max = parseInt(max)

        return !Array.isArray(received) && !isNaN(parseInt(received)) ?
          received && parseInt(received) > max
        :
          received.length && received.length > max
      }
    },

    min: {
      message: {
        numeric: 'The :attribute must be atleast :min.',
        file: 'The :attribute must be atleast :min files.',
        string: 'The :attribute must be atleast :min characters.',
        array: 'The :attribute must be atleast :min items.',
      },
      exe(received, min) {
        min = parseInt(min)

        return !Array.isArray(received) && !isNaN(parseInt(received)) ?
          received && parseInt(received) < min
        :
          received.length && received.length < min
      }
    },

    required: {
      message: 'The :attribute field is required.',
      exe(received) {
        return !received.length
      }
    },

    mimes: {
      message: 'The :attribute only allow :mimes.',
      exe(received, mimes) {
        return !Array.from(received).every(file => {
          const filename = file.name.split('.')
          return mimes.includes(filename[filename.length - 1].toLowerCase())
        })
      }
    }
  }

  class Validator {
    constructor(data, rules) {
        this.data = data
        this.rules = rules
        this.messages = []
    }

    fails() {
      let isFail = false

      this.messages = Object.keys(this.rules).map((name) => { 
        const { rules, label } = this.rules[name]
        const validate = Validator.validate(this.data[name], rules, label || name)
        if(validate.isInvalid && !isFail) {
          isFail = true
        }
        return [name, validate.message]
      })
      .filter(([, message]) => !!message)

      return isFail
    }

    errors() {
      return new Map(this.messages)
    }
  }

  Validator.make = function (data, rules) {
    return new Validator(data, rules)
  }

  Validator.validate = function (received, rules, attribute) {
    const array_rules = rules.split('|')
    let catch_name, catch_value, catch_third
    const isInvalid = array_rules.some((validation, index) => {
      const [name, value, third] = validation.split(/:|=/)
      catch_name = name
      catch_value = value
      catch_third = third
      if(!validationlist[name]) throw new TypeError(`Validator does not recognize validate name "${name}" in '${attribute}' [validate="${rules}"]`)
      return validationlist[name].exe(received, value, third)
    })

    if(isInvalid) {
      let validationlist_message = validationlist[catch_name].message
      let message;
      if(validationlist_message.toString() === '[object Object]') {
        if(!Array.isArray(received) && !isNaN(parseInt(received))) {
          validationlist_message = validationlist_message.numeric
        } else if(typeof received === 'string') {
          validationlist_message = validationlist_message.string
        } else if(Array.isArray(received)) {
          validationlist_message = validationlist_message.array
        } else {
          validationlist_message = validationlist_message.file
        }
      }

      message = validationlist_message.replace(':attribute', attribute)

      if(catch_value) {
        if(catch_value.includes('@')) {
          const [ , alias] = catch_value.split('@')
          catch_value = alias
        }
        message = message.replace(`:${catch_name}`, (catch_value || '').replace(/,/g, ', '))
      }

      if(catch_third) {
        if(catch_third.includes('@')) {
          const [ , alias] = catch_third.split('@')
          catch_third = alias
        }
        message = message.replace(':third_party', catch_third)
      }

      return {
        isInvalid,
        message
      }
    }

    return { isInvalid, message: null }
  }

  Validator.rulesExtend = function (extension) {
    Object.assign(validationlist, extension)
  }
    
  if(window.document)
    return window.Validator = Validator
  
  return Validator
})
