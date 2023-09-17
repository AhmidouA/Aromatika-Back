// module nodemailer pour les envois des mail auto (reset password)
const nodemailer = require ('nodemailer')


const mail = {
    async  sendPasswordResetEmail(user, token) {
    const transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const restPassword = `https://aromatika-back-api.onrender.com/profile/forgot-password/${user.id}/${token}`;
    const mailOption = {
        from: process.env.EMAIL_USERNAME,
        to: user.mail,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Bonjour ${user.username},\n\nVous avez demandé une réinitialisation de votre mot de passe. 
               Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe: ${restPassword}
               \n\nCordialement,\nL\'équipe de support`
  
    }
    transporter.sendMail(mailOption, function(err, info){
        if (err) {
            console.log(err)
        } else {
            console.log("email sent: " + info.response)
        }
    })
    }
} 

module.exports = mail;



