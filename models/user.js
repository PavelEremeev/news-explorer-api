const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /[a-zA-ZА-ЯЁа-яё\s\d\-]+/.test(v);
      },
      message: 'Введите имя',
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Неккоректный e-mail');
      }
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = model('user', userSchema);
