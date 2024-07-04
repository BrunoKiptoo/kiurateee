// import MailDev from "maildev";
// import nodemailer, { Transporter } from "nodemailer";
// import { nodeEnv } from "../env";
// import Logger from "../../utils/logger";
// import mailgun from "mailgun-js";
// import { MAILGUN_API_KEY as api_key, MAILGUN_DOMAIN as mgDomain } from "../env";

// const maildev = new MailDev({
//   smtp: 1025,
// });

// const mg = mailgun({ apiKey: api_key || "", domain: mgDomain || "" });
// const senderMail = "mail@kiurate.com";

// maildev.listen();

// let transporter: Transporter;

// if (nodeEnv === "development") {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//   transporter = nodemailer.createTransport({
//     host: "localhost",
//     port: 1025,
//     secure: false,
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
// }

// async function sendMail(receiverEmail: string, subject: string, text: string, html: string) {
//   const mailOptions = {
//     from: `Kiurate <${senderMail}>`,
//     to: receiverEmail,
//     subject,
//     text,
//     html,
//   };

//   if (nodeEnv === "development") {
//     return transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         Logger.error("Error sending test email:", error);
//       } else {
//         Logger.info(`Email sent: ${mailOptions.to} ` + info.response);
//       }
//     });
//   } else {
//     try {
//       await mg.messages().send(mailOptions);
//       Logger.info(`Email sent: ${mailOptions.to}`);
//     } catch (error) {
//       console.error("Error sending test email");
//       Logger.error("Error sending test email:", error);
//     }
//   }
// }

// export default sendMail;
