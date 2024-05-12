import axios from 'axios';

const sendSMS = async (
  phoneNumber: string,
  message: string,
): Promise<void> => {
  try {
    // Proceed to send an SMS regardless of rate limiting for excluded numbers
    const response = await axios.post('http://bulksmsbd.net/api/smsapi', {
      api_key: "api key",
      senderid: id,
      number: phoneNumber,
      message: message,
    });

    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
};

export { sendSMS };
