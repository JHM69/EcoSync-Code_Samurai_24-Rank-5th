/* eslint-disable import/prefer-default-export */
// s3Client.ts
import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
} as S3ClientConfig);
