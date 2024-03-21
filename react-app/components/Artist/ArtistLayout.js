import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Section = ({ title, children, ...props }) => (
  <section className="mb-3 rounded-md border px-3 py-4" {...props}>
    <h3 className="mb-3 text-xl font-semibold text-gray-500">{title}</h3>
    {children}
  </section>
)
 
const ArtistLayout = ({ artist }) => {
  return (
    <div className="mt-6 flex flex-col gap-4 overflow-auto md:flex-row">
      <div className='w-full lg:w-1/2' >   <Section title={'Artist'}>
        {artist.primaryImage ? (
             <img
             height={150}
             width={150}
             className=" max-h-[150px] max-w-[150px] rounded"
             src={artist.primaryImage}
             alt={artist.name}
           />
          ) : (
            <p className=" h-[100px] w-[100px] text-center font-bold text-gray-300">
              No Image
            </p>
          )}
          <p className="font-bold   text-2xl">{artist.name}</p>
        </Section>
         
        <Section title={'Genres'}>
  <div className="flex">
    {artist.genres?.map((genre, id) => (
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
          <p className="text-md max-w-md">Bio: {artist.bio}</p>
          <p className="text-xs">Born Year: {artist.dob}</p>
        </Section>
        <Section title={'Follower'}>
          <p className="text-xs">{artist.followerCount}</p>
          </Section>
        <Section title={'Social'}>
          <p className="text-md max-w-md"> Facebook:  {artist.fb} </p>
          <p className="text-md max-w-md"> Twitter:  {artist.twitter} </p>
        </Section>
        
      </div>
      <div>
         
        <Section title={'Songs'}>
          {artist.songs?.length ? (
            <div className="flex flex-col items-start">
              {
                artist.songs?.map((song, idx) => (
                  <div key={idx} className="mb-2">
                    <Link href={`/song/${song.slug}`}>
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



        
          {artist.bandMembers?.length > 0 && (
          <Section title={'Members'}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {
                artist.bandMembers?.map((artist, idx) => (
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

       {artist.bandMemberOf?.length> 0 && (
          <Section title={'Band Member Of'}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {
                artist.bandMemberOf?.map((artist, idx) => (
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

export default ArtistLayout
