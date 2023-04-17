const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const imageSchema = mongoose.Schema({
    image_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    created_at: String
});

const itemSchema = new mongoose.Schema({
    title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 1000
    },
    tag: String,
    usersReported: [mongoose.Schema.Types.ObjectId],
    image: {
        type: imageSchema,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    //username is their email
	email: {
		type: String,
		required: true
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: imageSchema,
    },
    bio: {
        type: String,
        maxLength: 300 // may have to update later accordingly
    }, 
    name: {
        type: String,
        required: true
    },
    items: {
        type: [itemSchema]
    },
    resetPasswordToken: {
        type: String,
        resetPasswordExpires: Date
    }
})

userSchema.pre('save', function(next) {
	const user = this; // binds this to User document instance

	// checks to ensure we don't hash password more than once
	if (user.isModified('password')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

userSchema.statics.findByEmailPassword = function(email, password) {
	const User = this // binds this to the User model

	// First find the user by their email
	return User.findOne({ email: email }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

const User = mongoose.model("User", userSchema)

module.exports = { User }