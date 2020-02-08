( function( global, factory ) {


	if ( typeof module === "object" && typeof module.exports === "object" ) {
    
		module.exports = factory( global )
      
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window ) { 

    const extension = {
        
        alpha_space: {
            regexp: /^[A-Za-z\s]+$/,
            message: 'The :attribute must contain letters with spaces.',
            exe(received) {
            return received.length && !this.regexp.test(received)
            }
        },

        alpha_dash: {
            regexp: /^[a-zA-Z\d-]+$/,
            message: 'The :attribute may only contain letters, numbers, and dashes.',
            exe(received) {
            return received.length && !this.regexp.test(received)
            }
        },

        alpha_num: {
            regexp: /^[a-zA-Z\d]+$/,
            message: 'The :attribute may only contain letters and numbers.',
            exe(received) {
            return received.length && !this.regexp.test(received)
            }
        },

        url: {
            regexp: /^(?:https?:\/\/)?([a-z]{3}\.)?([a-z]{3,20}\.)?[\w]{3,20}\.[a-z]{2,3}(?:\/.*)?$/,
            message: 'The :attribute must be a valid url.',
            exe(received) {
            return received.length && !this.regexp.test(received)
            }
        },

        max_size: {
            message: 'The :attribute may not be greater :max_size kilobytes.',
            exe(received, max_size) {
            max_size = parseInt(max_size)
            return received.length && Array.from(received).some(value => (value.size/1000) > max_size)
            }
        },

        min_size: {
            message: 'The :attribute must be atleast :min_size kilobytes.',
            exe(received, min_size) {
            min_size = parseInt(min_size)
            return received.length && Array.from(received).some(value => (value.size/1000) < min_size)
            }
        },

        required_if: {
            message: 'The :attribute field is required when :required_if is :third_party.',
            exe(received, name, value) {
                const [realname] = name.split('@')
                const [realvalue] = value.split('@')
                if(realname)
                    name = realname
                if(realvalue)
                    value = realvalue
                const target = document.querySelector(`[name="${name}"]`)
                if(!target) throw Error(`form (input, select, or textarea) that has a attribute [name = "${name}"] doesn't exist`)
                return !received.length && new RegExp(`^${value.trim()}$`).test(target.value)
            }
        },

        same: {
            message: 'The :attribute and :same must match.',
            exe(received, name) {
                const [realname] = name.split('@')
                if(realname)
                name = realname
                const target = document.querySelector(`[name="${name}"]`)
                if(!target) throw Error(`form (input, select, or textarea) that has a attribute [name = "${name}"] doesn't exist`)
                return received.length && target.value !== received
            }
        },
    }

    if(window.document)
        return window.ValidatorExtension = extension
  
    return extension
})


