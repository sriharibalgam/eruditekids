const validators = {

    validatePassword: (password: string) => {
        if (password && password.length < 6) {
            return false;
        }
        return true;
    },

    validateEmail: (email: string) => {
        const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(.[a-zA-Z])$/;
        const regEx = new RegExp(emailPattern);
        if (email && emailPattern.test(email)) {
            return false;
        }
        return true;
    }

};

export default validators;
