
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

export const getAlbums = async (query: any, username?: string) => {
  const andQueries = buildFindAllQuery(query, username);


  if ('search' in query) {
    andQueries.push({
      name: {
        contains: query.search,
        mode: 'insensitive',
      },
    });
  }




  const albumsCount = await prisma.album.count({
    where: {
      AND: andQueries,
    },
  });

  const albums = await prisma.album.findMany({
    where: { AND: andQueries },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      mainArtist:
      {
        select: {
          name: true,
          slug: true,
          primaryImage: true,
        },
      },
    }, 
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 10,
     
  });

  return {
    albums,
    albumsCount,
  };
};

export const createAlbum = async (album: any, username : string) => {
  const { 
    contentType,
coverImage ,
duration ,
genres ,
isPremium ,
label ,
language ,
name ,
releaseDate ,
trillerAvailable ,
price , 
currency,
mainArtistSlug,
primaryArtists,
featuredArtists,
trillerUrl
  } = album;

 

  if (!name ) {
    throw new HttpException(422, { errors: { title: ["Required Name fields are missing"] } });
  }
 
  const data : any = {
    slug : `${slugify(name)}`,
    contentType,
coverImage ,
duration : Number(duration) || 0,

isPremium : (isPremium === "true") ,
label ,
language: language || "Bangla" ,
name ,
likes : 0,
plays : 0,
disabled : false,
origin : "local",
mainArtist : {
  connect : {
    slug : mainArtistSlug
  }
},
trillerUrl,
releaseDate: new Date(releaseDate) , 
releaseYear : new Date(releaseDate).getFullYear().toString() ,
trillerAvailable : (trillerAvailable === "true"),
    addedBy: {
      connect: {
        username,
      },
    },
    }

    if(genres) {
      data.genres = {
        connectOrCreate: genres.map((genre: any) => ({
          where: {
            slug: genre,
          },
          create: {
            slug: `${slugify(genre)}`,
            name: genre,
          },
        })),
      };
    }

    if(primaryArtists){
      data.primaryArtists = {
        connect: primaryArtists.map((artist: any) => ({
          slug: artist,
        })),
      }
    }
    if(featuredArtists){
      data.featuredArtists = {
        connect: featuredArtists.map((artist: any) => ({
          slug: artist,
        })),
      }
    }

    if(isPremium === "true" && price) {
      data.price = price;
      data.currency =  currency || "BDT";
    }else{
      data.price = 0;
      data.currency =  "BDT"; 
    }

    const al = await prisma.album.create({
      data
    }).catch((e) => { 
      throw new HttpException(422, { errors: { title: ["Required Name fields are missing"] } });
    });

  return {
    album : al
  };
};

export const getAlbum = async (slug: string) => {
  const album = await prisma.album.findUnique({
    where: {
      slug,
    },
    include : {
      mainArtist:
      {
        select: {
          name: true,
          slug: true,
          primaryImage: true,
        },
      },
      primaryArtists: {
        select: {
          name: true,
          slug: true,
          primaryImage: true,
        },
      },
      featuredArtists: {
        select: {
          name: true,
          slug: true,
          primaryImage: true,
        },
      },
      genres: {
        select: {
          name: true,
          slug: true,
        },
      },
      songs : {
         select: {
          name : true,
          slug : true,
          duration : true,
          primaryImage : true,
       }
      }
    },

  });

  return {
    album
  };
};

export const getAlbumById = async (slug: string) => {  
  const album = await prisma.album.findUnique({
    where: {
      slug
    },
    include: {
      addedBy: true,
      songs: {
        include: {
          primaryArtists: {
            select: {
              name: true,
              slug : true,
              primaryImage: true,
            },
          }, 
          album: {
            select: {
              name: true,
              coverImage: true,
              slug: true,
            },
          },
          genres: {
            select: {
              name: true,
            },
          },
        }, 
      },
    },
  });
 
  
  const data = {
    "id": album?.id,
    "title":  album?.name,
    "subtitle":  album?.label,
    "header_desc": "album?.description",
    "type": "album",
    "perma_url": `shuno-cms/album/${album?.slug}`,
    "image": album?.coverImage,
    "language": album?.language,
    "list_count":  album?.songs.length.toString() || "0",
    "list_type": "",
    "list": album?.songs ,
    "more_info": {
      "artists": album?.songs?.map((song: any) =>
          song?.primaryArtists.map((artist: any) => ({
                "id": artist.slug,
                "name": artist.name,
                "role": "primary_artist",
                "image": artist.primaryImage,
        }))
      ),
    },
    "modules": {
      "list": {
        "source": "list",
        "position": 1,
        "score": "",
        "bucket": "",
        "scroll_type": "Cells_Standard",
        "title": "",
        "subtitle": "",
        "highlight": "",
        "simpleHeader": false,
        "noHeader": true,
        "view_more": [],
        "is_JT_module": false
      },
      
      "relatedPlaylist": {
        "source": "reco.getPlaylistReco",
        "position": 2,
        "score": "",
        "bucket": "",
        "scroll_type": "SS_Basic",
        "title": "Related Playlist",
        "subtitle": "",
        "highlight": "",
        "simpleHeader": false,
        "noHeader": false,
        "source_api": true,
        "source_params": {
          "listid": "47599074"
        },
        "view_more": [],
        "is_JT_module": false
      },
      "currentlyTrendingPlaylists": {
        "source": "content.getTrending",
        "position": 3,
        "score": "",
        "bucket": "",
        "scroll_type": "SS_Basic",
        "title": "Currently Trending Playlists",
        "subtitle": "",
        "highlight": "",
        "simpleHeader": false,
        "noHeader": false,
        "source_api": true,
        "source_params": {
          "entity_type": "album",
          "entity_language": "hindi"
        },
        "view_more": [],
        "is_JT_module": false
      },
      "artists": {
        "source": "artists",
        "position": 4,
        "score": "",
        "bucket": "",
        "scroll_type": "SS_Basic",
        "title": "Artists",
        "subtitle": "",
        "highlight": "",
        "simpleHeader": false,
        "noHeader": false,
        "view_more": [],
        "is_JT_module": false
      }
    }
  }

  return data
  ;
};


export const updateAlbum = async (album: any, slug: string) => {


  const { 
    contentType,
coverImage ,
duration ,
genres ,
isPremium ,
label ,
language ,
name ,
releaseDate ,
trillerAvailable ,
price , 
currency,
mainArtistSlug,
primaryArtists,
featuredArtists,
trillerUrl
  } = album;

 

  if (!name ) {
    throw new HttpException(422, { errors: { title: ["Required Name fields are missing"] } });
  }
 

  const data : any = {
    slug : `${slugify(name)}`,
    contentType,
coverImage ,
duration : Number(duration) || 0,

isPremium : (isPremium === "true") ,
label ,
language: language || "Bangla" ,
name, 
mainArtist : {
  connect : {
    slug : mainArtistSlug
  }
},
trillerUrl,
releaseDate: new Date(releaseDate) , 
releaseYear : new Date(releaseDate).getFullYear().toString() ,
trillerAvailable : (trillerAvailable === "true"),
    }

    if(genres) {
      data.genres = {
        connect: genres.map((genre: any) => ({
          slug: genre,
        })),
      };
    }

    if(primaryArtists){
      data.primaryArtists = {
        connect: primaryArtists.map((artist: any) => ({
          slug: artist,
        })),
      }
    }
    if(featuredArtists){
      data.featuredArtists = {
        connect: featuredArtists.map((artist: any) => ({
          slug: artist,
        })),
      }
    }

    if(isPremium === "true" && price) {
      data.price = price;
      data.currency =  currency || "BDT";
    }else{
      data.price = 0;
      data.currency =  "BDT"; 
    }

 
  const updatedAlbum = await prisma.album.update({
    where: {
      slug,
    },
    data,
  }).catch((e) => {  
    throw new HttpException(422, { errors: { title: ["Required Name fields are missing"] } });
    
  }
  );

  return {
    updatedAlbum
  };
};

export const deleteAlbum = async (slug: string) => {
  await prisma.album.delete({
    where: {
      slug,
    },
  });
};
