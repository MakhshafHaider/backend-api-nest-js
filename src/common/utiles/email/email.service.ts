import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const { EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT } = process.env;

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(
    email: string,
    mailSubject: string,
    content: string,
    attachment: any
  ): Promise<void> {
    const mailOptions = {
      from: EMAIL_USERNAME,
      to: email,
      subject: mailSubject,
      html: content,
    };

    const sent = await this.transporter.sendMail(mailOptions);
    {
      if (sent) {
        return sent;
      }
    }
  }

  async sendPrescribersListEmail(
    email: string,
    mailSubject: string,
    content: string,
    attachment: any
  ): Promise<void> {
    const mailOptions = {
      from: EMAIL_USERNAME,
      to: email,
      subject: mailSubject,
      html: content,
      attachments: [
        {
          filename: attachment.filename,
          content: attachment.content,
        },
      ],
    };

    const sent = await this.transporter.sendMail(mailOptions);
    {
      if (sent) {
        return sent;
      }
    }
  }
}
