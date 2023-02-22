const {userModel} = require("../models")

const userController = {
    index (req, res) {
        res.render("signup")
    },
    async signup (req, res) {
        const formData = req.body;

        const isError = await userModel.insertUser(formData)

        if (isError) {
            res.render("5OO")
        } else {
            res.redirect("/signup")
        }
        
    }
};

module.exports = userController;
