const { Schema, model } = require('mongoose');
const validator = require('validator');

const cardSchema = new Schema({
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
      message: 'Введите описание',
    },
  },
  link: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error('Неккоректная ссылка');
      }
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model('card', cardSchema);
