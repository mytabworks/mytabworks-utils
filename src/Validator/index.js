( function( global, factory ) {


	if ( typeof module === "object" && typeof module.exports === "object" ) {
    
		module.exports = factory( global )
      
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window ) { 
  
  class Validator {
    constructor(extension) {
        Validator.extend(extension)
    }

    validate(received, validations, attribute) {
      const validationlist = Validator.validationlist
      const array_validations = validations.split('|')
      let catch_name, catch_value, catch_third
      const isInvalid = array_validations.some((validation, index) => {
        const [name, value, third] = validation.split(/:|=/)
        catch_name = name
        catch_value = value
        catch_third = third
        return validationlist[name] && validationlist[name].exe(received, value, third)
      })

      if(isInvalid) {
        let validationlist_message = validationlist[catch_name].message
        let message;
        if(validationlist_message.toString() === '[object Object]') {
          if(typeof received === 'string') {
            validationlist_message = validationlist_message.string
          } else if(!isNaN(parseInt(received))) {
            validationlist_message = validationlist_message.numeric
          } else if(Array.isArray(received)) {
            validationlist_message = validationlist_message.array
          } else {
            validationlist_message = validationlist_message.file
          }
        }

        message = validationlist_message.replace(':attribute', attribute)

        if(catch_value) {
          if(Validator.supportAlias.includes(catch_name)) {
            const [ , alias] = catch_value.split('@')
            if(alias) catch_value = alias
          }
          message = message.replace(`:${catch_name}`, (catch_value || '').replace(',', ', '))
        }

        if(catch_third) {
          if(Validator.supportAlias.includes(catch_name)) {
            const [ , alias] = catch_third.split('@')
            if(alias) catch_third = alias
          }
          message = message.replace(':third_party', catch_third)
        }

        return {
          isInvalid,
          message
        }
      }

      return { isInvalid }
    }
  }

  Validator.extend = function (extension) {
    Object.assign(Validator.validationlist, extension)
  }

  Validator.supportAlias = ['required_if', 'same']
  
  Validator.validationlist = {
    alpha: {
      regexp: /^[A-Za-z]+$/,
      message: 'The :attribute may only contain letters.',
      exe(received) {
        return received.length && !this.regexp.test(received)
      }
    },

    email: {
      regexp: /^[\w.]{2,40}@[\w]{2,20}.[a-z]{2,3}$/,
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

        return !isNaN(parseInt(received)) ?
          received && parseInt(received) > max
        :
          received && received.length > max
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

        return !isNaN(parseInt(received)) ?
          received && parseInt(received) < min
        :
          received && received.length < min
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
          return mimes.includes(filename[filename.length - 1])
        })

      }
    },

    max_size: {
      message: 'The :attribute may not be greater :max_size kilobytes.',
      exe(received, max_size) {
        max_size = parseInt(max_size)
        return received.length && Array.from(received).some(value => (value.size/1000) > max_size)
      }
    }
  }
    
  if(window.document)
    return window.Validator = Validator
  
  return Validator
})
