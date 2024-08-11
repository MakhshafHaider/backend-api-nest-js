import { Injectable } from "@nestjs/common";
import * as Twilio from "twilio";

import * as dotenv from "dotenv";

dotenv.config();

const {
  TWILIO_VERIFY_SID,
  TWILIO_VERIFY_ACCOUNT_SID,
  TWILIO_VERIFY_AUTH_TOKEN,
} = process.env;

@Injectable()
export class TwilioSmsService {
  private readonly twilioClient: Twilio.Twilio;
  private readonly verifyServiceSid: string = TWILIO_VERIFY_SID;

  constructor() {
    const accountSid = TWILIO_VERIFY_ACCOUNT_SID;
    const authToken = TWILIO_VERIFY_AUTH_TOKEN;
    this.twilioClient = Twilio(accountSid, authToken);
  }

  async sendSmsCode(phoneNumber: string, channel: "sms") {
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          to: phoneNumber,
          channel: channel,
        });
      return { verification: verification.status };
    } catch (error) {
      return { error: error };
    }
  }

  async verifySmsCode(phoneNumber: string, code: string) {
    try {
      const verificationCheck = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code: code,
        });
      return { verification: verificationCheck.status };
    } catch (error) {
      return { error: error };
    }
  }
}
