import nodemailer from 'nodemailer';
import { env } from 'process';
import dotenv from 'dotenv';
dotenv.config();

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const nodemailerConfig = JSON.parse(String(env.NODEMAILER_CONFIG));

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  try {
    const info = await transporter.sendMail({
      from: nodemailerConfig?.auth?.user,
      ...data,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error for handling at a higher level
  }
};
