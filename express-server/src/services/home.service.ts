/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */

 
import { ContentType } from '@prisma/client';
import prisma from '../../prisma/prisma-client';
 
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




interface ContentFetchOptions {
  contentType: ContentType;
  limit: number;
}

async function fetchContent({ contentType, limit }: ContentFetchOptions) {

  console.log("Fetching content for contentType: ", contentType, " and limit: ", limit);
  const items = await prisma.album.findMany({
    where: { contentType  },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      coverImage: true,
      duration: true,
      label: true,
      releaseYear: true,
      language: true,
      plays: true,
      contentType: true,
      mainArtist: {
        select: {
          name: true,
          slug: true,
          primaryImage: true,
        },
      },
      songs: {
        select: {
          slug: true,
        },
      },
      genres: {
        select: {
          name: true,
        },
      },
    },
  });

  return items.map(item => ({
    id: item.slug,
    title: item.name,
    subtitle: item.label,
    header_desc: "",
    type: "album",
    perma_url:  item.slug, 
    image:  item.coverImage,                                             
    language: item.language,
    year:  item.releaseYear,
    play_count:  item.plays || "0",
    explicit_content: "0",
    list_count: "0",
    list_type: "",
    list: "",
    more_info: {
      release_date:  item.releaseYear,
      song_count:  item.songs.length.toString() || "0",
      artistMap: {
        primary_artists:  [],
        featured_artists:  [],
        artists: {
            id: item?.mainArtist?.slug,
            name: item?.mainArtist?.name,
            role: "primary_artist",
            image: item?.mainArtist?.primaryImage,
         },
      }
    },
    modules: null
  }));
}

export const getHomeData = async (query: any, username?: string) => {
  const andQueries = buildFindAllQuery(query, username);
 
  if ('search' in query) {
    andQueries.push({
      name: {
        contains: query.search,
        mode: 'insensitive',
      },
    });
  }

  const playlists = await prisma.playlist.findMany({
    where: { AND: andQueries },
    orderBy: {
      updatedAt: 'desc',
    },
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 5,
    select: {
        name: true,
        slug: true,
        primaryImage: true, 
        duration: true,
        year: true,
        language: true, 
        url: true,
        type: true, 
        artists: {
            select: {
            name: true,
            slug: true,
            primaryImage: true,
            
            },
        },
        songs : {
            select: {
            slug: true,
            },
        },
        genres: {
            select: {
            name: true,
            },
        },
    },
  });


  // eslint-disable-next-line camelcase
  const new_trending  = playlists.map((playlist: any) => ({
    id: playlist.slug,
    title: playlist.name,
    subtitle: playlist.label,
    header_desc: "",
    type: "playlist",
    perma_url: `https://www.shuno.com/playlist${playlist.slug}`,
    image:  playlist.primaryImage,                                             
    language: playlist.language,
    year:  playlist.year,
    play_count:  playlist.play_count || "0",
    explicit_content: "0",
    list_count: "0",
    list_type: "",
    list: "",
    more_info: {
      release_date:  playlist.year,
      song_count:  playlist.songs.length.toString() || "0",
      artistMap: {
        primary_artists: [],
        featured_artists: [],
        artists: playlist?.artists?.map((artist: any) => ({
            id: artist.slug,
            name: artist.name,
            role: "primary_artist",
            image: artist.primaryImage,
         })),
      }
    },
    modules: null
  }));

  const albums = await prisma.album.findMany({
    where: { AND: andQueries },
    orderBy: {
       updatedAt : 'desc',
    },
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 5,
    select: {
        id : true,
        name: true,
        slug: true,
        coverImage: true, 
        duration: true, 
        language: true,  
        contentType: true, 
        mainArtist: {
            select: {
            name: true,
            slug: true,
            primaryImage: true,
            
            },
        },
        songs : {
            select: {
            slug: true,
            },
        },
        genres: {
            select: {
            name: true,
            },
        },
    },
  });

  const new_albums  = albums.map((album: any) => ({
    id: album.slug,
    title: album.name,
    subtitle: album.label,
    header_desc: "",
    type: "album",
    perma_url:  album.slug, 
    image:  album.coverImage,                                             
    language: album.language,
    year:  album.year,
    play_count:  album.play_count || "0",
    explicit_content: "0",
    list_count: "0",
    list_type: "",
    list: "",
    more_info: {
      release_date:  album.year,
      song_count:  album.songs.length.toString() || "0",
      artistMap: {
        primary_artists: [],
        featured_artists: [],
        artists: album?.artists?.map((artist: any) => ({
            id: artist.slug,
            name: artist.name,
            role: "primary_artist",
            image: artist.primaryImage,
         })),
      }
    },
    modules: null
  }));

  // eslint-disable-next-line no-console
  console.log("Fetched new_albums");


  function createModule(source : any, position : number, title : string, api : string) {
    // eslint-disable-next-line no-console
    console.log("Creating module for source: ", source, " and title: ", title);
    return {
      source,
      position,
      score: "",
      bucket: "",
      scroll_type: "SS_Condensed_Double",
      title,
      subtitle: "",
      highlight: "",
      simpleHeader: false,
      noHeader: false,
      view_more: {
        api,
        page_param: "p",
        size_param: "n",
        default_size: 5,
        scroll_type: "SS_Basic_Double"
      },
      is_JT_module: false
    };
  }

  // eslint-disable-next-line no-console
  console.log("Fetching contentTypes");


  const contentTypes : ContentType[] = ['MUSIC', 'PODCAST', 'AUDIOBOOK', 'POEM' as const];
  const results = await Promise.all(contentTypes.map(type   => 
    fetchContent({ contentType: type as ContentType, limit: Number(query.limit) || 5 })
  ));

  const [songs, podcasts, audiobooks, poems] = results;
 
  const modules = {
    new_trending: createModule("new_trending", 1, "Trending", "content.getTrending"),
    new_albums: createModule("new_albums", 2, "Recommended", "content.getAlbums"),
    songs: createModule("songs", 3, "Songs", "content.getSongs"),  
    podcasts: createModule("podcasts", 4, "Podcasts", "content.getPodcasts"),  
    audiobooks: createModule("audiobooks", 5, "Audio Books", "content.getAudiobooks"), 
    poems: createModule("poems", 6, "Poems Reciting", "content.getPoems")  
  };
  
  return {
    new_trending,
    new_albums,
    songs ,
    podcasts,
    audiobooks,
    poems,
    modules
  };
   
};
 