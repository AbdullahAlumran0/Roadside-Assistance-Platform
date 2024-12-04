import dotenv from 'dotenv';
dotenv.config(); 
import twilio  from "twilio";

const serviceSid = process.env.TWILIO_SERVICE_SID;  
const accountSid = process.env.TWILIO_ACCOUNT_SID;  
const authToken = process.env.TWILIO_AUTH_TOKEN;   


const client = twilio(accountSid, authToken);

export async function validateCode(codeEnteredByUser) {
    try {
    //   const userNumber = localStorage.getItem('userNumber', "+966");
    //   const vertificationSID = localStorage.getItem('vertificationSID');
      const verificationCheck = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: userNumber,  
          code: codeEnteredByUser,  
        });
        
      console.log('Verification Check status:', verificationCheck.status);
  
      
      if (verificationCheck.status === 'approved') {
        console.log('Verification successful!');
        
      } else {
        console.log('Verification failed. The code is incorrect.');
        
      }
    } catch (error) {
      console.error('Error during verification check:', error.message);
    }
  }

