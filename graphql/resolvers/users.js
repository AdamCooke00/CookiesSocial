const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require('apollo-server');
const {validateRegisterInput, validateLoginInput} = require("../../util/validators");
const {SECRET_KEY} = require("../../config");

generateToken = (user => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, {expiresIn: '1h'});
});

module.exports = {
    Mutation: {
        async login(parent, args, context, info){
            let {username, password} = args;
            const {valid, errors} = await validateLoginInput(username, password);
            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            const user = await User.findOne({username});
            if(!user){
                errors.general = "Invalid Username";
                throw new UserInputError('User not found', {errors})
            } else if (!(await bcrypt.compare(password, user.password))){
                errors.general = "Password is incorrect";
                throw new UserInputError('Wrong Pass', {errors})
            }
            const token = generateToken(user);
            return{
                ...user._doc,
                id: user._id,
                token
            } 
        },
        async register(parent, args, context, info){
            let {username, email, password, confirmPassword} = args.registerInput;

            const {valid, errors} = await validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', {errors});
            }

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);
            return{
                ...res._doc,
                id: res._id,
                token
            }

        }
    }
}