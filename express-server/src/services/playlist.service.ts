
import slugify from 'slugify';
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';
import { Artist, Song } from '@prisma/client';

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

export const getPlaylists = async (query: any, username?: string) => {
  const andQueries = buildFindAllQuery(query, username);
  const playlistsCount = await prisma.playlist.count({
    where: {
      AND: andQueries,
    },
  });

  const playlists = await prisma.playlist.findMany({
    where: { AND: andQueries },
    orderBy: {
      createdAt: 'desc',
    },
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 10,
      
  });

  return {
    playlists,
    playlistsCount,
  };
};

export const createPlaylist = async (playlist: any, username : string) => {
  const { 
    name,  
    
  } = playlist;

  if (!name ) {
    throw new HttpException(422, { errors: { title: ["Required Name fields are missing"] } });
  }

  return {
     
  };
};

export const getPlaylist = async (slug: string) => {
  const playlist = await prisma.playlist.findUnique({
    where: {
      slug,
    },
    include: {
      addedBy: true,
      songs: {
        include: {
          primaryArtists: true,
          album: true,
          genres: true,
        }, 
      },
    },
  });
  return {
    playlist
  };
};


export const getPlaylistById = async (slug: string) => { 
  const playlist = await prisma.playlist.findUnique({
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
          featuredArtists: {
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
    "id": playlist?.id,
    "title":  playlist?.name,
    "subtitle":  playlist?.subtitle,
     
    "type": "playlist",
    "perma_url": "shuno-cms.com\/playlist\/" + playlist?.id,
    "image": playlist?.primaryImage,
    "language": playlist?.language,
    "year": playlist?.year,
     
    "list_count":  playlist?.songs.length.toString() || "0",
    
    "list": playlist?.songs ,
    "more_info": {
       
      "artists": playlist?.songs?.map((song: any) =>
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
          "entity_type": "playlist",
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

export const updatePlaylist = async (playlist: any, slug: string) => {

  const updatedPlaylist = await prisma.playlist.update({
    where: {
      slug,
    },
    data: {
      slug : `${slugify(playlist.name)}`,
      ...playlist
    },
   
  });

  return {
    updatedPlaylist
  };
};

export const deletePlaylist = async (slug: string) => {
  await prisma.playlist.delete({
    where: {
      slug,
    },
  });
};
