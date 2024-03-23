// eslint-disable-next-line import/no-unresolved
import nodemailer from 'nodemailer';
import { env } from 'process';
 
type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const nodemailerConfig = JSON.parse(String(env.NODEMAILER_CONFIG));

// eslint-disable-next-line import/prefer-default-export
export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  // eslint-disable-next-line no-return-await
  return await transporter.sendMail({
    from: nodemailerConfig?.auth?.user,
    ...data,
  });
};
