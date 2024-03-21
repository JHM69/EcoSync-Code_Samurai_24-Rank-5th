import React from 'react'
import Layout from '../../components/layout'
import PlaylistLayout from '../../components/Playlist/PlaylistLayout'
import DeletePlaylist from '../../components/Playlist/DeletePlaylist'
import UpdatePlaylist from '../../components/Playlist/UpdatePlaylist'

 

function Playlist({ playlist }) {
  return (
    <Layout meta={{ name: playlist?.name || 'Playlist' }}>
      <div>
        <header className="my-3 flex flex-col items-center justify-between rounded-md md:flex-row">
          <h1 className="mb-3 truncate text-xl font-bold text-gray-700">
            <span className="mr-2 text-sm font-medium text-gray-500">
              Playlist:{' '}
            </span>
            {playlist?.name}
          </h1>
          <div className="flex items-center space-x-2">
            <UpdatePlaylist playlist={playlist} />
            <DeletePlaylist
              disabled={
                playlist?.id === 'rec_ce0bsgt8oiq6e92pa810' ||
                playlist?.id === 'rec_ce0btqp99gj1h1lgvno0'
              }
              playlistId={playlist?.id}
            />
          </div>
        </header>
        {playlist ? (
          <PlaylistLayout playlist={playlist} />
        ) : (
          <div className="w-full text-center text-2xl font-bold text-gray-300">
            No details
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Playlist

export async function getStaticProps({ params }) {
  try {
    const playlists = []
    const data = playlists
      .filter({
        id: params.id,
      })
      .getMany()
    return {
      props: { playlist: data[0] },
    }
  } catch (error) {
    return {
      props: {},
    }
  }
}

export async function getStaticPaths() {
  const playlists = []
  return {
    paths: playlists.map((item) => ({
      params: { id: item.id },
    })),
    fallback: true,
  }
}
