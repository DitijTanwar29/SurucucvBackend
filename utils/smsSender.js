// const axios = require('axios');
// const xmlbuilder = require('xmlbuilder');

// async function sendSmsOtp(contactNumber, otp) {
//   const xmlData = xmlbuilder.create('mainbody')
//     .ele('header')
//       .ele('usercode', '2166066134').up()
//       .ele('password', 'W5-1vhsX').up()
//       .ele('msgheader', 'ADRTURKLTD.').up()
//       .ele('appkey', '01007a72af089606218e04d553a740f5').up()
//     .up()
//     .ele('body')
//       .ele('msg')
//         .dat(`Your OTP is ${otp}`)  // Correctly placed CDATA text
//       .up()
//       .ele('no', contactNumber).up()
//     .up()
//   .end({ pretty: true });

//   const response = await axios.post('https://api.netgsm.com.tr/sms/send/otp', xmlData, {
//     headers: {
//       'Content-Type': 'application/xml'
//     }
//   });

//   console.log(response.data.result)

//   if (response.data.result !== '00') {
//     throw new Error('Failed to send OTP');
    
//   }

//   console.log("SMS sent successfully to:", contactNumber);
// }

// module.exports = { sendSmsOtp };



const axios = require('axios');
const { DOMParser } = require('xmldom');

async function sendSmsOtp(contactNumber, otp) {
  const xmlData = `<?xml version="1.0"?>
<mainbody>
   <header>
       <usercode>2166066134</usercode>
       <password>W5-1vhsX</password>
       <msgheader>ADRTURKLTD.</msgheader>
       <appkey>01007a72af089606218e04d553a740f5</appkey> 
   </header>
   <body>
       <msg>
           <![CDATA[Your OTP is ${otp}]]>
       </msg>
       <no>${contactNumber}</no>
   </body>
</mainbody>`;

  try {
    const response = await axios.post('https://api.netgsm.com.tr/sms/send/otp', xmlData, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "application/xml");
    const code = xmlDoc.getElementsByTagName("code")[0].textContent;

    if (code !== '0') {
      const error = xmlDoc.getElementsByTagName("error")[0].textContent;
      throw new Error(`Failed to send OTP: ${error}`);
    }

    console.log("SMS sent successfully to:", contactNumber);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw new Error("Failed to send OTP");
  }
}

module.exports = { sendSmsOtp };

