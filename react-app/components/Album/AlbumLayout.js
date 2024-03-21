import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
 
const Section = ({ title, children, ...props }) => (
  <section className="mb-3 rounded-md border px-3 py-4" {...props}>
    <h3 className="mb-3 text-xl font-semibold text-gray-500">{title}</h3>
    {children}
  </section>
)
 
const AlbumLayout = ({ album }) => {
  function formatDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
  
    const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
    return formattedDuration;
  }

  return (
    <div className="mt-6 flex flex-col gap-4 overflow-auto md:flex-row">
      <div className='w-full lg:w-1/2'>   <Section title={'Album'}>
        {album.coverImage ? (
             <img
             height={150}
             width={150}
             className=" max-h-[150px] max-w-[150px] rounded"
             src={album.coverImage}
             alt={album.name}
           />
          ) : (
            <p className=" h-[100px] w-[100px] text-center font-bold text-gray-300">
              No Image
            </p>
          )}
          <p className="font-bold   text-2xl">{album.name}</p>
        </Section>

        <Section title={'Artist'}>
        {album.mainArtist?.primaryImage ? (
             <img
             height={100}
             width={100}
             className=" max-h-[150px] justify-center max-w-[150px] rounded-full"
             src={album.mainArtist?.primaryImage}
             alt={album.name}
           />
          ) : (
            <p className=" h-[100px] w-[100px] text-center font-bold text-gray-300">
              Not Found
            </p>
          )}
          <Link href={`/artist/${album.mainArtist?.slug}`}>
           <p className='text-md max-w-md'>{album.mainArtist?.name}</p>
           </Link>
          </Section>
         
        <Section title={'Genres'}>
  <div className="flex">
    {album.genres?.map((genre, id) => (
      <div
      className={`bg-blue-200 rounded-full px-2 mx-1 text-md max-w-md`}
      
        key={id}
      >
        {genre.slug}
      </div>
    ))}
  </div>
</Section>
        <Section title={'Info'}>
          <p className="text-md max-w-md">{album.label}</p>
          <p className="text-md max-w-md">Duration: {formatDuration(album.duration)}</p>
          <p className="text-xs">Release Date: {new Date(album.releaseDate).toLocaleDateString()}</p>
        </Section>
        
      </div>
      <div>
         
        <Section title={'Songs'}>
          {album.songs?.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {
                album.songs?.map((song, idx) => (
                  <div key={idx} className="mb-2">
                    <Link href={`/song/${song.id}`}>
                      <a className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            src={song.primaryImage}
                            alt={song.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-md">{song.name}</p> 
                        </div>
                      </a>
                    </Link>
                  </div>
                ))

              }
           
            </div>
          ) : (
            <p className="h-[100px] w-[400px] text-center font-bold text-gray-300">
              No Songs
            </p>
          )}
        </Section>

        <Section title={'Stat'}>
          <p className="text-md max-w-md">Paly: {album.plays}</p> 
          <p className="text-md max-w-md">Like: {album.likes}</p>
        </Section>
        <Section title={'Pricing'}>
          {
            album.price>0 ? (
              <p className="text-md max-w-md">Price: {album.price} {album.currency}</p>

            ) : (
              <p className="text-md max-w-md">Price: Free</p>
            )

          }
          </Section>
       
        

        
          {album.primaryArtists?.length > 0 && (
          <Section title={'Primary Artist'}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {
                album.primaryArtists?.map((artist, idx) => (
                    <div key={idx} className="mb-2">
                    <Link href={`/artist/${artist.slug}`}>
                      <a className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            src={artist.primaryImage}
                            alt={artist.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-md">{artist.name}</p> 
                        </div>
                      </a>
                    </Link>
                    </div>
                ))

              }
           
            </div> </Section>
          )  }

       {album.featuredArtists?.length> 0 && (
          <Section title={'Featured Artist'}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {
                album.featuredArtists?.map((artist, idx) => (
                    <div key={idx} className="mb-2">
                    <Link href={`/artist/${artist.slug}`}>
                      <a className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            src={artist.primaryImage}
                            alt={artist.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-md">{artist.name}</p> 
                        </div>
                      </a>
                    </Link>
                    </div>
                ))

              }
           
            </div> </Section>
          )  }
       


      </div>
    </div>
  )
}

export default AlbumLayout
