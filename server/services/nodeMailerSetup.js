const nodemailer = require("nodemailer");

async function main(recieverAddress, subject, text, html) {
    let transporter = nodemailer.createTransport({
        name : 'Techer',
        host: "mail.coderunner.in",
        port: 465,
        secure: true,
        auth: {
            user: 'info@coderunner.in',
            pass: 'XiKPEnMqDJY3fhq',
        },
        tls: {
           rejectUnauthorized : false
        }
    });
  
    let info = await transporter.sendMail({
      from: '"Techer" <info@coderunner.in>', // sender address
      to: String(recieverAddress), // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
  }
  
 module.exports = main;