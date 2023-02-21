


const userController = {
    index (req, res) {
        res.render("signup")
    },
    signup (req, res) {
        const {pseudo, email, password } = req.body;

        res.redirect("/signup")

    }
};

module.exports = userController;
