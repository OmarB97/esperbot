/* eslint-disable @typescript-eslint/camelcase */
import { required, email, alpha_num } from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

extend('required', {
    ...required,
    message: 'This field is required',
});

extend('email', {
    ...email,
    message: 'Please enter a valid email address',
});

/* eslint-disable camelcase */
extend('alpha_num', {
    ...alpha_num /* eslint-disable camelcase */,
    message: 'Only letters and numbers are valid characters.',
});

extend('correctKeyLength', {
    validate: key => {
        return key.length === 25;
    },
    message: 'License key must be 25 characters long.',
});
