/* eslint-disable import/no-extraneous-dependencies */


import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { GoogleGenerativeAIEmbeddings  } from "@langchain/google-genai";
import { PrismaClient, Prisma, Song } from "@prisma/client";

// add prisma to the NodeJS global type
// TODO : downgraded @types/node to 15.14.1 to avoid error on NodeJS.Global
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}



export const songStore = PrismaVectorStore.withModel<Song>(prisma).create(
  new GoogleGenerativeAIEmbeddings(),
  {
    prisma: Prisma,
    tableName: "Song",
    vectorColumnName: "vector",
    columns: {
      contentType: PrismaVectorStore.ContentColumn,
      id: PrismaVectorStore.IdColumn,
      name : PrismaVectorStore.ContentColumn,
      slug : PrismaVectorStore.ContentColumn,
      label : PrismaVectorStore.ContentColumn,
      primaryImage : PrismaVectorStore.ContentColumn,
      duration : PrismaVectorStore.ContentColumn,
      year : PrismaVectorStore.ContentColumn,
      origin : PrismaVectorStore.ContentColumn,
      content : PrismaVectorStore.ContentColumn,
      tags : PrismaVectorStore.ContentColumn,
      mood : PrismaVectorStore.ContentColumn,
      lyricsSnippet : PrismaVectorStore.ContentColumn,
      url : PrismaVectorStore.ContentColumn,
      albumId : PrismaVectorStore.ContentColumn,
      hasLyrics : PrismaVectorStore.ContentColumn,
      isDolbyContent : PrismaVectorStore.ContentColumn,
    },
    filter: {
      origin: {
        equals: "MUSIC",
      },
    },
  }
);


export const podcastStore = PrismaVectorStore.withModel<Song>(prisma).create(
  new GoogleGenerativeAIEmbeddings(),
  {
    prisma: Prisma,
    tableName: "Song",
    vectorColumnName: "vector",
    columns: {
      contentType: PrismaVectorStore.ContentColumn,
      id: PrismaVectorStore.IdColumn,
      name : PrismaVectorStore.ContentColumn,
      slug : PrismaVectorStore.ContentColumn,
      label : PrismaVectorStore.ContentColumn,
      primaryImage : PrismaVectorStore.ContentColumn,
      duration : PrismaVectorStore.ContentColumn,
      year : PrismaVectorStore.ContentColumn,
      origin : PrismaVectorStore.ContentColumn,
      content : PrismaVectorStore.ContentColumn,
      tags : PrismaVectorStore.ContentColumn,
      mood : PrismaVectorStore.ContentColumn,
      lyricsSnippet : PrismaVectorStore.ContentColumn,
      url : PrismaVectorStore.ContentColumn,
      albumId : PrismaVectorStore.ContentColumn,
      hasLyrics : PrismaVectorStore.ContentColumn,
      isDolbyContent : PrismaVectorStore.ContentColumn,
    },
    filter: {
      origin: {
        equals: "PODCAST",
      },
    },
  }
);



export const poemsStore = PrismaVectorStore.withModel<Song>(prisma).create(
  new GoogleGenerativeAIEmbeddings(),
  {
    prisma: Prisma,
    tableName: "Song",
    vectorColumnName: "vector",
    columns: {
      contentType: PrismaVectorStore.ContentColumn,
      id: PrismaVectorStore.IdColumn,
      name : PrismaVectorStore.ContentColumn,
      slug : PrismaVectorStore.ContentColumn,
      label : PrismaVectorStore.ContentColumn,
      primaryImage : PrismaVectorStore.ContentColumn,
      duration : PrismaVectorStore.ContentColumn,
      year : PrismaVectorStore.ContentColumn,
      origin : PrismaVectorStore.ContentColumn,
      content : PrismaVectorStore.ContentColumn,
      tags : PrismaVectorStore.ContentColumn,
      mood : PrismaVectorStore.ContentColumn,
      lyricsSnippet : PrismaVectorStore.ContentColumn,
      url : PrismaVectorStore.ContentColumn,
      albumId : PrismaVectorStore.ContentColumn,
      hasLyrics : PrismaVectorStore.ContentColumn,
      isDolbyContent : PrismaVectorStore.ContentColumn,
    },
    filter: {
      origin: {
        equals: "POEM",
      },
    },
  }
);


export const bookStore = PrismaVectorStore.withModel<Song>(prisma).create(
  new GoogleGenerativeAIEmbeddings(),
  {
    prisma: Prisma,
    tableName: "Song",
    vectorColumnName: "vector",
    columns: {
      contentType: PrismaVectorStore.ContentColumn,
      id: PrismaVectorStore.IdColumn,
      name : PrismaVectorStore.ContentColumn,
      slug : PrismaVectorStore.ContentColumn,
      label : PrismaVectorStore.ContentColumn,
      primaryImage : PrismaVectorStore.ContentColumn,
      duration : PrismaVectorStore.ContentColumn,
      year : PrismaVectorStore.ContentColumn,
      origin : PrismaVectorStore.ContentColumn,
      content : PrismaVectorStore.ContentColumn,
      tags : PrismaVectorStore.ContentColumn,
      mood : PrismaVectorStore.ContentColumn,
      lyricsSnippet : PrismaVectorStore.ContentColumn,
      url : PrismaVectorStore.ContentColumn,
      albumId : PrismaVectorStore.ContentColumn,
      hasLyrics : PrismaVectorStore.ContentColumn,
      isDolbyContent : PrismaVectorStore.ContentColumn,
    },
    filter: {
      origin: {
        equals: "AUDIOBOOK",
      },
    },
  }
);



export default prisma;