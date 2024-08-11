import { Injectable, Logger } from "@nestjs/common";
import { Twilio } from "twilio";

import * as dotenv from "dotenv";

dotenv.config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;

@Injectable()
export class TwilioOtpService {
  async sendOtpTwilioEmail(emailAddress: any): Promise<boolean> {
    try {
      const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const verification = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verifications.create({
          to: emailAddress,
          channel: "email",
        });
      if (verification.sid) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async verifyOtpTwilio(emailAddress: string, otp: any): Promise<boolean> {
    try {
      const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const verification = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
          to: emailAddress,
          code: otp,
        });
      if (verification.status === "approved") {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
