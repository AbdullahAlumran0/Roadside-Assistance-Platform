import dotenv from 'dotenv';
dotenv.config(); 
import twilio  from "twilio";

const serviceSid = process.env.TWILIO_SERVICE_SID;  
const accountSid = process.env.TWILIO_ACCOUNT_SID;  
const authToken = process.env.TWILIO_AUTH_TOKEN;   

const client = twilio(accountSid, authToken);

export async function createVerification(number) {
  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        channel: 'sms',
        to: "+966"+ number.slice(1),  
      });
  } catch (error) {
    console.error('Error creating verification:', error.message);
  }
  
}
