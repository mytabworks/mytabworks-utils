const Validator = require('../')
const {alpha_dash, alpha_num, alpha_space, max_size, min_size, url} = require("../../../extend/rules")
describe('Validator supported test agrregation', () => {
    test('Validator.validate required', () => {
        let required_fails = Validator.validate("", "required", "Required")
        expect(required_fails.isInvalid).toBeTruthy()
        expect(required_fails.message).toBe("The Required field is required.")
        
        required_fails = Validator.validate([], "required", "Required")
        expect(required_fails.message).toBe("The Required field is required.")
        expect(required_fails.isInvalid).toBeTruthy()

        let required_passed = Validator.validate("ad3ead", "required", "Required")
        expect(required_passed.isInvalid).toBeFalsy()
        expect(required_passed.message).toBe(null)
        
        required_passed = Validator.validate([1], "required", "Required")
        expect(required_passed.message).toBe(null)
        expect(required_passed.isInvalid).toBeFalsy()
    })

    test('Validator.validate min', () => {
        let min_fails, min_passed
        min_fails = Validator.validate("asda", "min:5", "min")
        expect(min_fails.isInvalid).toBeTruthy()
        expect(min_fails.message).toBe("The min must be atleast 5 characters.")

        min_passed = Validator.validate("asdas", "min:5", "min")
        expect(min_passed.isInvalid).toBeFalsy()
        expect(min_passed.message).toBe(null)
        
        min_fails = Validator.validate(['10','2','3','4'], "min:5", "min")
        expect(min_fails.message).toBe("The min must be atleast 5 items.")
        expect(min_fails.isInvalid).toBeTruthy() 

        min_passed = Validator.validate(['1','2','3','4','5'], "min:5", "min")
        expect(min_passed.message).toBe(null)
        expect(min_passed.isInvalid).toBeFalsy()

        min_fails = Validator.validate("4", "min:5", "min")
        expect(min_fails.isInvalid).toBeTruthy()
        expect(min_fails.message).toBe("The min must be atleast 5.")

        min_passed = Validator.validate("5", "min:5", "min")
        expect(min_passed.isInvalid).toBeFalsy()
        expect(min_passed.message).toBe(null)
        
        min_passed = Validator.validate("", "min:5", "min")
        expect(min_passed.message).toBe(null)
        expect(min_passed.isInvalid).toBeFalsy()
        
        min_passed = Validator.validate([], "min:5", "min")
        expect(min_passed.message).toBe(null)
        expect(min_passed.isInvalid).toBeFalsy()

        min_fails = Validator.validate("", "required|min:5", "min")
        expect(min_fails.isInvalid).toBeTruthy()
        
        min_fails = Validator.validate([], "required|min:5", "min")
        expect(min_fails.isInvalid).toBeTruthy()

        
    })

    test('Validator.validate max', () => {
        let max_fails, max_passed
        max_fails = Validator.validate("asdaasds", "max:5", "max")
        expect(max_fails.isInvalid).toBeTruthy()
        expect(max_fails.message).toBe("The max may not be greater than 5 characters.")

        max_passed = Validator.validate("asdas", "max:5", "max")
        expect(max_passed.isInvalid).toBeFalsy()
        expect(max_passed.message).toBe(null)
        
        max_fails = Validator.validate([1,2,3,4, 5, 6], "max:5", "max")
        expect(max_fails.message).toBe("The max may not be greater than 5 items.")
        expect(max_fails.isInvalid).toBeTruthy() 

        max_passed = Validator.validate(['110','2','3','4','5'], "max:5", "max")
        expect(max_passed.message).toBe(null)
        expect(max_passed.isInvalid).toBeFalsy()

        max_fails = Validator.validate("6", "max:5", "max")
        expect(max_fails.isInvalid).toBeTruthy()
        expect(max_fails.message).toBe("The max may not be greater than 5.")

        max_passed = Validator.validate("5", "max:5", "max")
        expect(max_passed.isInvalid).toBeFalsy()
        expect(max_passed.message).toBe(null)
        
        max_passed = Validator.validate("", "max:5", "max")
        expect(max_passed.message).toBe(null)
        expect(max_passed.isInvalid).toBeFalsy()
        
        max_passed = Validator.validate([], "max:5", "max")
        expect(max_passed.message).toBe(null)
        expect(max_passed.isInvalid).toBeFalsy()
        
        max_fails = Validator.validate("", "required|max:5", "max") 
        expect(max_fails.isInvalid).toBeTruthy()

        max_fails = Validator.validate([], "required|max:5", "max") 
        expect(max_fails.isInvalid).toBeTruthy()
    })

    test('Validator.validate alpha', () => {
        let alpha_fails = Validator.validate("dasdsad1", "alpha", "alpha")
        expect(alpha_fails.isInvalid).toBeTruthy()
        expect(alpha_fails.message).toBe("The alpha may only contain letters.")
        
        alpha_fails = Validator.validate([1], "alpha", "p")
        expect(alpha_fails.message).toBe("The p may only contain letters.")
        expect(alpha_fails.isInvalid).toBeTruthy()

        let alpha_passed = Validator.validate("adhgjghjgjhead", "alpha", "alpha")
        expect(alpha_passed.isInvalid).toBeFalsy()
        expect(alpha_passed.message).toBe(null)
        
        alpha_passed = Validator.validate("", "alpha", "alpha")
        expect(alpha_passed.message).toBe(null)
        expect(alpha_passed.isInvalid).toBeFalsy()

        alpha_passed = Validator.validate("", "required|alpha", "alpha") 
        expect(alpha_passed.isInvalid).toBeTruthy()

    })

    test('Validator.validate email', () => {
        let email_fails, email_passed
        email_fails = Validator.validate("dasdsad1", "email", "email")
        expect(email_fails.isInvalid).toBeTruthy()
        expect(email_fails.message).toBe("The email must be a valid email.")
        
        email_fails = Validator.validate([1], "email", "p")
        expect(email_fails.message).toBe("The p must be a valid email.")
        expect(email_fails.isInvalid).toBeTruthy()

        email_fails = Validator.validate("dasdasd2da@dasdsa.cac.sds", "email", "email")
        expect(email_fails.isInvalid).toBeTruthy()
        expect(email_fails.message).toBe("The email must be a valid email.")

        email_passed = Validator.validate("dasdasd2da@dasdsa.cac", "email", "email")
        expect(email_passed.isInvalid).toBeFalsy()
        expect(email_passed.message).toBe(null)

        email_passed = Validator.validate("dasdasd2da@dasdsa.cac.sd", "email", "email")
        expect(email_passed.isInvalid).toBeFalsy()
        expect(email_passed.message).toBe(null)
 
        email_passed = Validator.validate("", "email", "email")
        expect(email_passed.message).toBe(null)
        expect(email_passed.isInvalid).toBeFalsy()

        email_fails = Validator.validate("", "required|email", "email") 
        expect(email_fails.isInvalid).toBeTruthy()

    })

    test('Validator.validate mimes', () => {
        let mimes_fails, mimes_passed
        mimes_fails = Validator.validate([{name: "sample.bar"}], "mimes:jpg,zip,rar", "mimes")
        expect(mimes_fails.isInvalid).toBeTruthy()
        expect(mimes_fails.message).toBe("The mimes only allow jpg, zip, rar.")
        
        mimes_fails = Validator.validate([{name: "sample.jpeg"}], "mimes:jpg,zip,rar", "p")
        expect(mimes_fails.message).toBe("The p only allow jpg, zip, rar.")
        expect(mimes_fails.isInvalid).toBeTruthy()

        mimes_fails = Validator.validate([{name: "sample.jpg.rar.sds"}], "mimes:jpg,zip,rar", "mimes")
        expect(mimes_fails.isInvalid).toBeTruthy()
        expect(mimes_fails.message).toBe("The mimes only allow jpg, zip, rar.")

        mimes_fails = Validator.validate([{name: "sample.jpg.rar"}, {name: "sample.jpg.ror"}], "mimes:jpg,zip,rar", "mimes")
        expect(mimes_fails.isInvalid).toBeTruthy()
        expect(mimes_fails.message).toBe("The mimes only allow jpg, zip, rar.")

        mimes_passed = Validator.validate([{name: "sample.jr.jpg"}, {name: "sample.jr.zip"}, {name: "sample.jr.rar"}], "mimes:jpg,zip,rar", "mimes")
        expect(mimes_passed.isInvalid).toBeFalsy()
        expect(mimes_passed.message).toBe(null)

        mimes_passed = Validator.validate([{name: "sample.jr.jpg"}], "mimes:jpg,zip,rar", "mimes")
        expect(mimes_passed.isInvalid).toBeFalsy()
        expect(mimes_passed.message).toBe(null)

        mimes_passed = Validator.validate([{name: "sample.jr.zip"}], "mimes:jpg,zip,rar", "mimes")
        expect(mimes_passed.isInvalid).toBeFalsy()
        expect(mimes_passed.message).toBe(null)

        mimes_passed = Validator.validate([{name: "sample.jr.rar"}], "mimes:jpg,zip,rar", "mimes")
        expect(mimes_passed.isInvalid).toBeFalsy()
        expect(mimes_passed.message).toBe(null)

        mimes_passed = Validator.validate([], "mimes:jpg,zip,rar", "mimes")
        expect(mimes_passed.message).toBe(null)
        expect(mimes_passed.isInvalid).toBeFalsy()

        mimes_fails = Validator.validate([], "required|mimes:jpg,zip,rar", "mimes")
        expect(mimes_fails.isInvalid).toBeTruthy()

    })
})

describe('Validator extended test agrregation', () => {
    test('Validator.validate alpha_dash', () => {
        Validator.rulesExtend({ alpha_dash })
        let alpha_dash_fails, alpha_dash_passed
        alpha_dash_fails = Validator.validate("dasdsad asdas2312-asd-", "alpha_dash", "alpha_dash")
        expect(alpha_dash_fails.isInvalid).toBeTruthy()
        expect(alpha_dash_fails.message).toBe("The alpha_dash may only contain letters, numbers, and dashes.")

        alpha_dash_fails = Validator.validate("dasd2ads_sad1", "alpha_dash", "alpha_dash")
        expect(alpha_dash_fails.isInvalid).toBeTruthy()
        expect(alpha_dash_fails.message).toBe("The alpha_dash may only contain letters, numbers, and dashes.")
        
        alpha_dash_fails = Validator.validate([12,23], "alpha_dash", "p")
        expect(alpha_dash_fails.message).toBe("The p may only contain letters, numbers, and dashes.")
        expect(alpha_dash_fails.isInvalid).toBeTruthy()

        alpha_dash_passed = Validator.validate("adhgjghjgjhead", "alpha_dash", "alpha_dash")
        expect(alpha_dash_passed.isInvalid).toBeFalsy()
        expect(alpha_dash_passed.message).toBe(null)

        alpha_dash_passed = Validator.validate("adhgj1232asd23123jgjhead", "alpha_dash", "alpha_dash")
        expect(alpha_dash_passed.isInvalid).toBeFalsy()
        expect(alpha_dash_passed.message).toBe(null)

        alpha_dash_passed = Validator.validate("adhgjg-hjg-j213sad-asd-head", "alpha_dash", "alpha_dash")
        expect(alpha_dash_passed.isInvalid).toBeFalsy()
        expect(alpha_dash_passed.message).toBe(null)
        
        alpha_dash_passed = Validator.validate("", "alpha_dash", "alpha_dash")
        expect(alpha_dash_passed.message).toBe(null)
        expect(alpha_dash_passed.isInvalid).toBeFalsy()

        alpha_dash_passed = Validator.validate("", "required|alpha_dash", "alpha_dash") 
        expect(alpha_dash_passed.isInvalid).toBeTruthy()

    })
    test('Validator.validate alpha_space', () => {
        Validator.rulesExtend({ alpha_space })
        let alpha_space_fails, alpha_space_passed
        alpha_space_fails = Validator.validate("dasdsad-adas2312-asd-", "alpha_space", "alpha_space")
        expect(alpha_space_fails.isInvalid).toBeTruthy()
        expect(alpha_space_fails.message).toBe("The alpha_space must contain letters with spaces.")

        alpha_space_fails = Validator.validate("das d2ads_sad1", "alpha_space", "alpha_space")
        expect(alpha_space_fails.isInvalid).toBeTruthy()
        expect(alpha_space_fails.message).toBe("The alpha_space must contain letters with spaces.")

        alpha_space_fails = Validator.validate("das-d2ads-sad1", "alpha_space", "alpha_space")
        expect(alpha_space_fails.isInvalid).toBeTruthy()
        expect(alpha_space_fails.message).toBe("The alpha_space must contain letters with spaces.")
        
        alpha_space_fails = Validator.validate([12,23], "alpha_space", "p")
        expect(alpha_space_fails.message).toBe("The p must contain letters with spaces.")
        expect(alpha_space_fails.isInvalid).toBeTruthy()

        alpha_space_passed = Validator.validate("adhgjghjgjhead", "alpha_space", "alpha_space")
        expect(alpha_space_passed.isInvalid).toBeFalsy()
        expect(alpha_space_passed.message).toBe(null)

        alpha_space_passed = Validator.validate("asdasd as das d    asd", "alpha_space", "alpha_space")
        expect(alpha_space_passed.isInvalid).toBeFalsy()
        expect(alpha_space_passed.message).toBe(null)
        
        alpha_dash_passed = Validator.validate("", "alpha_dash", "alpha_dash")
        expect(alpha_dash_passed.message).toBe(null)
        expect(alpha_dash_passed.isInvalid).toBeFalsy()

        alpha_dash_passed = Validator.validate("", "required|alpha_dash", "alpha_dash") 
        expect(alpha_dash_passed.isInvalid).toBeTruthy()

    })

    test('Validator.validate alpha_num', () => {
        Validator.rulesExtend({ alpha_num })
        let alpha_num_fails, alpha_num_passed
        alpha_num_fails = Validator.validate("dasdsad adas2312-asd-", "alpha_num", "alpha_num")
        expect(alpha_num_fails.isInvalid).toBeTruthy()
        expect(alpha_num_fails.message).toBe("The alpha_num may only contain letters and numbers.")

        alpha_num_fails = Validator.validate("das d2ads sad1", "alpha_num", "alpha_num")
        expect(alpha_num_fails.isInvalid).toBeTruthy()
        expect(alpha_num_fails.message).toBe("The alpha_num may only contain letters and numbers.")

        alpha_num_fails = Validator.validate("das-d2ads-sad1", "alpha_num", "alpha_num")
        expect(alpha_num_fails.isInvalid).toBeTruthy()
        expect(alpha_num_fails.message).toBe("The alpha_num may only contain letters and numbers.")
        
        alpha_num_fails = Validator.validate([12,23], "alpha_num", "p")
        expect(alpha_num_fails.message).toBe("The p may only contain letters and numbers.")
        expect(alpha_num_fails.isInvalid).toBeTruthy()

        alpha_num_passed = Validator.validate("adhgjghjgjhead", "alpha_num", "alpha_num")
        expect(alpha_num_passed.isInvalid).toBeFalsy()
        expect(alpha_num_passed.message).toBe(null)

        alpha_num_passed = Validator.validate("asdasd23324sadasd23", "alpha_num", "alpha_num")
        expect(alpha_num_passed.isInvalid).toBeFalsy()
        expect(alpha_num_passed.message).toBe(null)
        
        alpha_num_passed = Validator.validate("", "alpha_num", "alpha_num")
        expect(alpha_num_passed.message).toBe(null)
        expect(alpha_num_passed.isInvalid).toBeFalsy()

        alpha_num_passed = Validator.validate("", "required|alpha_num", "alpha_num") 
        expect(alpha_num_passed.isInvalid).toBeTruthy()

    })

    test('Validator.validate url', () => {
        Validator.rulesExtend({ url })
        let url_fails, url_passed
        url_fails = Validator.validate("dasdsad adas2312-asd-", "url", "url")
        expect(url_fails.isInvalid).toBeTruthy()
        expect(url_fails.message).toBe("The url must be a valid url.")

        url_fails = Validator.validate("www.sample.sample.sample.com", "url", "url")
        expect(url_fails.isInvalid).toBeTruthy()
        expect(url_fails.message).toBe("The url must be a valid url.")

        url_fails = Validator.validate("das-d2ads-sad1.com", "url", "url")
        expect(url_fails.isInvalid).toBeTruthy()
        expect(url_fails.message).toBe("The url must be a valid url.")
        
        url_fails = Validator.validate([12,23], "url", "p")
        expect(url_fails.message).toBe("The p must be a valid url.")
        expect(url_fails.isInvalid).toBeTruthy()

        url_passed = Validator.validate("sample.com", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)

        url_passed = Validator.validate("www.sample.com", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)

        url_passed = Validator.validate("http://www.sample.com", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)

        url_passed = Validator.validate("https://www.sample.com", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)

        url_passed = Validator.validate("https://www.sample.com.ph", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)

        url_passed = Validator.validate("https://www.sample.com.ph/asdsamasd/asdasd/", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)

        url_passed = Validator.validate("https://sample.com.ph/asdsamasd/asdasd/", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)

        url_passed = Validator.validate("https://www.sample.edu.ph/asdsamasd/asdasd/", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)

        url_passed = Validator.validate("https://sample.com/asdsamasd/asdasd/", "url", "url")
        expect(url_passed.isInvalid).toBeFalsy()
        expect(url_passed.message).toBe(null)
        
        url_passed = Validator.validate("", "url", "url")
        expect(url_passed.message).toBe(null)
        expect(url_passed.isInvalid).toBeFalsy()

        url_passed = Validator.validate("", "required|url", "url") 
        expect(url_passed.isInvalid).toBeTruthy()

    })

    test('Validator.validate min_size', () => {
        Validator.rulesExtend({ min_size })
        let min_size_fails, min_size_passed
        min_size_fails = Validator.validate([{size: 500000}], "min_size:1000", "min_size")
        expect(min_size_fails.isInvalid).toBeTruthy()
        expect(min_size_fails.message).toBe("The min_size must be atleast 1000 kilobytes.")

        min_size_fails = Validator.validate([{size: 500000}, {size: 1000000}], "min_size:1000", "min_size")
        expect(min_size_fails.isInvalid).toBeTruthy()
        expect(min_size_fails.message).toBe("The min_size must be atleast 1000 kilobytes.")

        min_size_fails = Validator.validate([{size: 999999}, {size: 1000000}], "min_size:1000", "min_size")
        expect(min_size_fails.isInvalid).toBeTruthy()
        expect(min_size_fails.message).toBe("The min_size must be atleast 1000 kilobytes.") 

        min_size_passed = Validator.validate([{size: 1000000}], "min_size:1000", "min_size")
        expect(min_size_passed.isInvalid).toBeFalsy()
        expect(min_size_passed.message).toBe(null)

        min_size_passed = Validator.validate([{size: 2000000}, {size: 1000000}], "min_size:1000", "min_size")
        expect(min_size_passed.isInvalid).toBeFalsy()
        expect(min_size_passed.message).toBe(null)

        min_size_passed = Validator.validate([], "min_size:1000", "min_size")
        expect(min_size_passed.message).toBe(null)
        expect(min_size_passed.isInvalid).toBeFalsy()
        
        min_size_passed = Validator.validate("", "min_size:1000", "min_size")
        expect(min_size_passed.message).toBe(null)
        expect(min_size_passed.isInvalid).toBeFalsy()

        min_size_passed = Validator.validate("", "required|min_size:1000", "min_size") 
        expect(min_size_passed.isInvalid).toBeTruthy()

    })

    test('Validator.validate max_size', () => {
        Validator.rulesExtend({ max_size })
        let max_size_fails, max_size_passed
        max_size_fails = Validator.validate([{size: 1000001}], "max_size:1000", "max_size")
        expect(max_size_fails.isInvalid).toBeTruthy()
        expect(max_size_fails.message).toBe("The max_size may not be greater 1000 kilobytes.")

        max_size_fails = Validator.validate([{size: 1000001}, {size: 1000000}], "max_size:1000", "max_size")
        expect(max_size_fails.isInvalid).toBeTruthy()
        expect(max_size_fails.message).toBe("The max_size may not be greater 1000 kilobytes.")

        max_size_fails = Validator.validate([{size: 999999}, {size: 1000001}], "max_size:1000", "max_size")
        expect(max_size_fails.isInvalid).toBeTruthy()
        expect(max_size_fails.message).toBe("The max_size may not be greater 1000 kilobytes.") 

        max_size_passed = Validator.validate([{size: 1000000}], "max_size:1000", "max_size")
        expect(max_size_passed.isInvalid).toBeFalsy()
        expect(max_size_passed.message).toBe(null)

        max_size_passed = Validator.validate([{size: 999999}, {size: 1000000}], "max_size:1000", "max_size")
        expect(max_size_passed.isInvalid).toBeFalsy()
        expect(max_size_passed.message).toBe(null)

        max_size_passed = Validator.validate([], "max_size:1000", "max_size")
        expect(max_size_passed.message).toBe(null)
        expect(max_size_passed.isInvalid).toBeFalsy()
        
        max_size_passed = Validator.validate("", "max_size:1000", "max_size")
        expect(max_size_passed.message).toBe(null)
        expect(max_size_passed.isInvalid).toBeFalsy()

        max_size_passed = Validator.validate("", "required|max_size:1000", "max_size") 
        expect(max_size_passed.isInvalid).toBeTruthy()

    })
})

describe('Validator mass rules test agrregation', () => {
    test('Validator.make test', () => {
        const forms = {
            first_name: "fernando",
            last_name: "tabs",
            email: "fernandotabs@gmail",
            web: "mytabworks.com",
            items: ["90293", "23223", "23232"]
        }

        const rules = {
            first_name: { 
                label: "First Name", 
                rules: "required|alpha" 
            },
            last_name: { 
                label: "First Name", 
                rules: "required|alpha|min:3" 
            },
            email: { 
                label: "E-mail", 
                rules: "required|email"
            },
            web: { 
                label: "Website", 
                rules: "required|url"
            },
            items: { 
                label: "Items", 
                rules: "required|min:2|max:4"
            }
        }
        const validator = Validator.make(forms, rules)

        let isfail = validator.fails()

        expect(isfail).toBeTruthy()

        let message = validator.errors()
        
        expect(message.has("email")).toBeTruthy()

        expect(message.has("items")).toBeFalsy()
        console.log(validator)
    })
})