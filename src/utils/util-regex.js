const nameRegex = /^[가-힣]{2,}$/;
const validCodeRegex = /^\d{6}$/;
const mobileRegex = /^010\d{8}$/;
const passwordRegex = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,}$/;
const birthRegex = /^\d{8}$/;

const valid = (field, value) => {
    switch(field) {
        case "NAME": 
            return nameRegex.test(value); 
        case "VALID_CODE": 
            return validCodeRegex.test(value);
        case "MOBILE":
            return mobileRegex.test(value);
        case "PASSWORD":
            return passwordRegex.test(value);
        case "BIRTH":
            return birthRegex.test(value);
    }
}
export { valid }