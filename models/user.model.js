const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters long"]
        },
        lastname: {
            type: String,
            minlength: [3, "Last name must be at least 3 characters long"]
        }
    },
    number: {
        type: Number,
        required: true,
        unique: true,
        min: 9100000000,
        max: 919999999999,
        set: v => {
            if (!/^[1-9]\d{9}$/.test(v)) {
                throw new Error("Number must be exactly 10 digits and not start with 0");
            }
            return Number(`91${v}`);
        }
    },
    accountType: {
        type: String,
        required: true,
        enum: ['User', 'Buisness Account']
    },
    contacts: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            name: {
                type: String
            },
            number: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return /^[1-9]\d{9}$/.test(v);
                    },
                    message: "Contact number must be exactly 10 digits and not start with 0"
                },
                set: v => Number(`91${v}`)
            }
        }
    ]
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;