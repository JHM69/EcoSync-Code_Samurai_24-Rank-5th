
import slugify from 'slugify';
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';

const buildFindAllQuery = (query: any, username: string | undefined) => {
  const queries: any = [];
  const orAuthorQuery = [];

  if (username) {
    orAuthorQuery.push({
      username: {
        equals: username,
      },
    });
  }
  return queries;
};

export const getArtists = async (query: any, username?: string) => {
  const andQueries = buildFindAllQuery(query, username);

  if ('search' in query) {
    andQueries.push({
      name: {
        contains: query.search,
        mode: 'insensitive',
      },
    });
  }

  const artistsCount = await prisma.artist.count({
    where: {
      AND: andQueries,
    },
  });

  const artists = await prisma.artist.findMany({
    where: { AND: andQueries },
    orderBy: {
      createdAt: 'desc',
    },
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 10,
     
  });

  return {
    artists,
    artistsCount,
  };
};

export const createArtist = async (artist: any, username : string) => {
  const { 
    name,
    creatorType,
    dominantLanguage,
    dominantType,
    bio,
    dob,
    fb,
    twitter,
    wiki,
    availableLanguages,
    isRadioPresent,
    isBand, 
    genres,
    primaryImage,
    images,
    bandMembers,
  } = artist;

    // eslint-disable-next-line no-console
    console.log("creating artist", username )
    // eslint-disable-next-line no-console
    console.log(artist)
    console.log(artist.bandMembers)
    console.log(artist.genres)
 

 
  if (!name ) {
    throw new HttpException(422, { errors: { title: [" Name fields are missing"] } });
  } 

  const data : any = {
    slug: `${slugify(name)}`,
    name,
    creatorType,
    primaryImage,
    followerCount: 0,
    fanCount: 0,
    isVerified: true,
    dominantLanguage,
    dominantType,
    bio,
    dob,
    fb,
    twitter,
    wiki,
    availableLanguages,
    isRadioPresent : (isRadioPresent === "true"),
    isBand: (isBand === "true"),
    addedBy: {
      connect: {
        username,
      },
    },
  }
    data.images = {
      create: {
         link : primaryImage,
         quality: "primary",
      },
    }
  

  if(genres && genres.length > 0){
    data.genres = {
      connectOrCreate: genres.map((genre: any) => ({
        where: { slug: genre },
        create: { slug: genre, name: genre },
      })),
    }
  }

  if(bandMembers && bandMembers.length > 0){
    data.bandMembers = {
      connect: bandMembers.map((bandMember: any) => ({
        slug: bandMember,
      })),
    }
  }
 
  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  
  if (!userExists) {
    throw new Error('User not found');
  }
  

  const createdArtist = await prisma.artist.create({
    data,
  }).catch((e) => { 
    // eslint-disable-next-line no-console
    console.log(e)
    throw new HttpException(422, { errors:  e  });
  }).then(() => {
     // eslint-disable-next-line no-console
     console.log("Artist Created")
  });
 
  // const createdArtist = await prisma.artist.create( {
  //   data:{
  //     name : data.name,
  //     slug: data.slug,
  //     creatorType: data.creatorType,
  //     primaryImage: data.primaryImage,
  //     followerCount: data.followerCount,
  //     fanCount: data.fanCount,
  //     isVerified: data.isVerified,
  //     dominantLanguage: data.dominantLanguage,

  //     dominantType: data.dominantType,
  //     bio: data.bio,
  //     dob: data.dob,
  //     fb: data.fb,
  //     twitter: data.twitter,
  //     wiki: data.wiki,
  //     availableLanguages: data.availableLanguages,
  //     isRadioPresent: data.isRadioPresent,
  //     isBand: data.isBand,
  //     addedBy: {
  //       connect: {
  //         username,
  //       },
  //     },
  //     genres: {
  //       connect: genres.map((genre: any) => ({
  //         slug: genre,
  //       })),
  //     },
  //     images: {
  //       create: images.map((image: any) => ({
  //         url: image.url,
  //         type: image.type,
  //       })),
  //     },
  //     bandMembers: {
  //       connect: bandMembers.map((bandMember: any) => ({
  //         slug: bandMember,
  //       })),
  //     }
  //  }
  // }).catch((e) => { 
  //   throw new HttpException(422, { errors:  e  });
  // }).then(() => {

  // });
 
  return {
    createdArtist 
  };
};

export const getArtist = async (slug: string) => {
  const artist = await prisma.artist.findUnique({
    where: {
      slug,
    },
    include: {
      addedBy: true,
      genres: {
        select: {
          slug: true, 
        }
      },
      images: true,
      bandMembers: {
        select: {
          slug: true,
          name: true,
          primaryImage: true,
        }
      },
      songs: {
        select: {
          slug: true,
          name: true, 
          primaryImage: true,
        }
      },
      bandMemberOf: {
        select: {
          slug: true,
          name: true,
          primaryImage: true,
        }
      }, 
    },
  });

  // eslint-disable-next-line no-console
  console.log("Added Artist ", artist?.addedBy)

  return {
    artist
  };
};

export const updateArtist = async (artist: any, slug: string) => {
  const { 
    name,
    creatorType,
    dominantLanguage,
    primaryImage,
    dominantType,
    bio,
    dob,
    fb,
    twitter,
    wiki,
    availableLanguages,
    isRadioPresent,
    isBand, 
    genres,
    bandMembers,
    images,
  } = artist;

  const data : any = {
    slug: `${slugify(name)}`,
    name,
    creatorType,
    primaryImage,
    followerCount: 0,
    fanCount: 0,
    isVerified: true,
    dominantLanguage,
    dominantType,
    bio,
    dob,
    fb,
    twitter,
    wiki,
    availableLanguages,
    isRadioPresent,
    isBand: (isBand === "true"),
  }

  if(genres[0].slug){
    // eslint-disable-next-line no-console
    console.log("genres1")
    // eslint-disable-next-line no-console
    console.log(genres)
    data.genres = {
      connect: genres.map((genre: any) => ({
        slug: genre.slug,
      })),
    }
  }

  if (genres && Array.isArray(genres) && genres.every((genre) => typeof genre === 'string')) {
    // eslint-disable-next-line no-console
    console.log("genres2")
    // eslint-disable-next-line no-console
    console.log(genres)
    data.genres = { 
      connect: genres.map((genre: string) => ({
        slug: genre,
      })),
    };
  }

  if(images){ 
    data.images = {
      create: images.map((image: any) => ({
        url: image.url,
        type: image.type,
      })),
    }
  }
  if(bandMembers){ 
    data.bandMembers = {
      connect: bandMembers.map((bandMember: any) => ({
        slug: bandMember,
      })),
    }
  }


  const updatedArtist = await prisma.artist.update({
    where: {
      slug,
    },
    data 
  // eslint-disable-next-line no-unused-vars
  }).catch((e) => {
    throw new HttpException(422, { errors: { title: ["Required Name fields are missing"] } });
    }
  );

  return {
    updatedArtist
  };
};

export const deleteArtist = async (slug: string) => {
  await prisma.artist.delete({
    where: {
      slug,
    },
  });
};
