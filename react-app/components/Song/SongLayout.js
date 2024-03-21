import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Section = ({ title, children, ...props }) => (
  <section className="mb-3 rounded-md border px-3 py-4" {...props}>
    <h3 className="mb-3 text-xl font-semibold text-gray-500">{title}</h3>
    {children}
  </section>
)
 
const SongLayout = ({ song }) => {
  function formatDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
  
    const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
    return formattedDuration;
  }

  return (
    <div className="mt-6 flex flex-col w-screen gap-4 overflow-auto md:flex-row">
      <div className='w-full lg:w-1/2'>  
        
         <Section title={'Song'}>
        {song.primaryImage ? (
             <img
             height={150}
             width={150}
             className=" justify-center max-h-[150px] max-w-[150px] rounded"
             src={song.primaryImage}
             alt={song.name}
           />
          ) : (
            <p className=" h-[100px] w-[100px] text-center font-bold text-gray-300">
              No Image
            </p>
          )}
          <p className="font-bold   text-2xl">{song.name}</p>

          <audio controls className="w-full">
            <source src={song.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

        </Section>

        <Section title={'Album Info'}> 
        {
            song.album?.coverImage ? (
              <img
              height={150}
              width={150}
              className=" max-h-[150px] max-w-[150px] rounded"
              src={song.album?.coverImage}
              alt={song.album?.name}
            />
            ) : (
              <p className=" h-[100px] w-[100px] text-center font-bold text-gray-300">
                No Image
              </p>
            )
          }
          
          <Link href={`/album/${song.album?.slug}`}>

          <p className="font-bold   text-2xl">{song.album?.name}</p>
        </Link>
        
          </Section>
         
        <Section title={'Genres'}>
  <div className="flex">
    {song.genres?.map((genre, id) => (
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
          <p className="text-md max-w-md">{song.label}</p>
          <p className="text-md max-w-md">Duration: {formatDuration(song.duration)}</p>
          <p className="text-xs">Release Date: {new Date(song.releaseDate).toLocaleDateString()}</p>
        </Section>
        
      </div>
      <div>
          
        <Section title={'Stat'}>
          <p className="text-md max-w-md">Paly: {song.plays}</p> 
          <p className="text-md max-w-md">Like: {song?._count?.likeds || 0}</p>
        </Section>
         <Section title={'Lyric'}>
          <p className="text-md max-w-md">{song.lyricsSnippet}</p>
          </Section>


          <Section title={'Language'}>
            <p className="text-md max-w-md">{song.language}</p> 
          </Section>
       
        

        
          {song.primaryArtists?.length > 0 && (
          <Section title={'Primary Artist'}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {
                song.primaryArtists?.map((artist, idx) => (
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

       {song.featuredArtists?.length> 0 && (
          <Section title={'Featured Artist'}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {
                song.featuredArtists?.map((artist, idx) => (
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

export default SongLayout
