const { categoryModel } = require("../models");

const categoryController = {
    async getAllCategories (req, res) {

        // on récuepre le nom de famille des catégories en params
        const family = req.params.family;
        // console.log("family>>>>>>", family)

        try {
            // on envoi le paramattre du nom de la famille dans la methode GetCategories() (=> dataMapper)
            const categories = await categoryModel.GetCategories(family)
            // console.log("categories>>>>>>", categories)

            res.status(200).json(categories);
        } catch(err) {
            console.error(err);
            res.status(500).json({ message: "Erreur serveur" });
        }     
    }, 
    
}


module.exports = categoryController;