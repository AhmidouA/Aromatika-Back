const { dbClient } = require ("../service")

const userModel = {
    async insertUser(formData) {
        const sqlQuery = `INSERT INTO "user" (pseudo, email, password) VALUES ($1,$2,$3)`;
        console.log("sqlQuery>>>>>" , sqlQuery)
        
        const values = [formData.pseudo, formData.email, formData.password];
        console.log("values>>>>>" , values)

        try {

            const result = await dbClient.query(sqlQuery, values);
            console.log("result>>>>>", result)
        }
        catch (err) { 
        console.error(err)
        }
    },
}

module.exports = userModel;