/*Group information:
 *
 *Student 1:
 *
 *Tran Ngoc Phuong Dang (a.k.a Daniel). Student number: 7843618
 *
 *Student 2:
 *
 *Chi Hieu Tran (a.k.a Winson). Student number: 7822620
 *
 *Student 3:
 *
 *Duncan Robertson. Student number: 8074833
 */
 
"use strict";
const nodemailer = require('nodemailer');

module.exports.send = function(to, subject, text){
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'recievewebdesign@gmail.com',
            pass: 'recievewebdesign123@'
        }
    });
    
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Instagram Clone" <instagram-noreply@gmail.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text // plain text body
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return error;
        }
    });
}