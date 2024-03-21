import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from './s3Client';

// eslint-disable-next-line import/prefer-default-export, no-undef
export const uploadToS3 = async (file: Express.Multer.File, bucketName: string, keyPrefix: string): Promise<string> => {
  const { originalname, buffer } = file;
  const key = `${keyPrefix}/${Date.now()}-${originalname}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ACL: 'public-read',
  }));

  return `https://${bucketName}.s3.amazonaws.com/${key}`;
};