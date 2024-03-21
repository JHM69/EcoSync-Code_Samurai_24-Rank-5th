import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import { MultipleSelect } from '../common/MultipleSelect' 
import RadioSelect from '../common/RadioSelect' 
import FormSection from '../common/Section' 
import { getBaseUrl } from '../../utils/url'
import axios from 'axios'
import { uploadImage, uploadAudio } from '../../utils/upload'
const SongForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm()

  useEffect(() => {
    if (defaultValues) {
      setValue('name', defaultValues.name) 
      setValue('releaseDate', new Date(defaultValues?.releaseDate)?.toISOString().split('T')[0])
      setValue('primaryImage', defaultValues?.primaryImage)
      setValue('duration', defaultValues?.duration)
      setValue('label', defaultValues.label)
      setValue('language', defaultValues.language)
      setValue('contentType', defaultValues.contentType)
      setValue('genres', defaultValues.genres?.map((genre) => genre.slug))
      setValue('primaryArtist', defaultValues?.primaryArtist?.map((artist) => artist.slug))
      setValue('featuredArtists', defaultValues?.featuredArtists?.map((artist) => artist.slug))
      setValue('album', defaultValues.album.slug)
      setValue('hasLyrics', defaultValues.hasLyrics)
      setValue('lyricsSnippet', defaultValues.lyricsSnippet)
      setValue('url', defaultValues.url)
      setValue('copyRight', defaultValues.copyRight)
      setValue('downloadUrls', defaultValues?.downloadUrls?.map((url) => url))
      setValue('origin', defaultValues.origin)
      setValue('tags', defaultValues?.tags)
      setValue('mood', defaultValues?.mood)
      setValue('lyricsSnippet', defaultValues.lyricsSnippet)
      setValue('encryptedMediaUrl', defaultValues.encryptedMediaUrl)
      setValue('encryptedMediaPath', defaultValues.encryptedMediaPath)
      setValue('mediaPreviewUrl', defaultValues.mediaPreviewUrl)
      setValue('permaUrl', defaultValues.permaUrl)
      setValue('kbps320', defaultValues.kbps320? "true" : "false")
      setValue('isDolbyContent', defaultValues.isDolbyContent ? "true" : "false")
    }
  }, [defaultValues, setValue])


  
  const primaryImageFile = watch("primaryImageFile");

  // This useEffect handles the file upload when a new file is selected
  useEffect(() => {
    if (primaryImageFile && primaryImageFile.length > 0) {
      const file = primaryImageFile[0];
      uploadImage(file).then(fileUrl => {
        // Assuming the uploadImage function returns the URL of the uploaded image
        setValue('primaryImage', fileUrl); // Update the form's primaryImage field with the uploaded image URL
      }).catch(error => {
        console.error("Error uploading image:", error);
      });
    }
  }, [primaryImageFile, setValue]);


  const urlFile = watch("urlFile");

  // This useEffect handles the file upload when a new file is selected
  useEffect(() => {
    if (urlFile && urlFile.length > 0) {
      const file = urlFile[0];
      uploadAudio(file).then(fileUrl => {
        // Assuming the uploadAudio function returns the URL of the uploaded image
        setValue('url', fileUrl); // Update the form's url field with the uploaded image URL
      }).catch(error => {
        console.error("Error uploading image:", error);
      });
    }
  }, [urlFile, setValue]);

  const [artists2 , setArtists2] = useState([]);
  const [artists3 , setArtists3] = useState([]);
  const [albums , setAlbums] = useState([]);
 
  const [search2, setSearch2] = useState('');
  const [search3, setSearch3] = useState('');
  const [search1, setSearch1] = useState('');

  useEffect(() => {
    axios.get(getBaseUrl()+`/albums?search=`+search1).then((res) => {
      setAlbums(res.data.albums)
      }
      ).catch((err) => {
        console.log(err)
      })
  }, [search1]);

useEffect(() => {

  axios.get(getBaseUrl()+`/artists?search=`+search2).then((res) => {
    setArtists2(res.data.artists)
    }
    ).catch((err) => {
      console.log(err)
    })
}, [search2]);



useEffect(() => {

  axios.get(getBaseUrl()+`/artists?search=`+search3).then((res) => {
    setArtists3(res.data.artists)
    }
    ).catch((err) => {
      console.log(err)
    })
}, [search3]);
 
  

  const onSubmit = handleSubmit(async (data) => {
    await onFormSubmit(data)
    reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
        <FormSection defaultOpen={true} title={'Song Information'}>
          <Input
            name="name"
            label="Name of the Song"
            placeholder="My beautiful song..."
            type="text"
            error={errors.name ? errors.name.message : false}
            register={register('name', {
              required: {
                value: true,
                message: 'You must add the name of your song.',
              },
            })}
          />


<div className="flex flex-col gap-4">
                <label htmlFor="primaryImageFile">Upload artist Image: </label> 
                
                <input
                  id="primaryImageFile"
                  name="primaryImageFile"
                  type="file"
                  accept="image/*"
                  {...register('primaryImageFile', {
                    required: {
                      value: false,
                      message: 'You must select an image to upload.',
                    },
                  })}
                />

                {errors.primaryImageFile && <p>{errors.primaryImageFile.message}</p>}

                {/* Hidden Input to store the Image URL after upload */}
                <input
                  type="hidden"
                  {...register('primaryImage')}
                />

                {
                    defaultValues?.primaryImage || watch('primaryImage') ? (
                    <img
                      className="w-1/2"
                      src={watch('primaryImage') || defaultValues?.primaryImage}
                      alt="Primary Image"
                    />
                  ) : null
                }

            </div>
 
          <Input
            name="releaseDate"
            label="Publish Date (optional)"
            placeholder="Publish date of the song..."
            type="date"
            error={errors.releaseDate ? errors.releaseDate.message : false}
            register={register('releaseDate')}
          />
          <Input
            name="duration"
            label="Duration of the song"
            placeholder="Duration of the song..."
            type="number"
            error={errors.duration ? errors.duration.message : false}
            register={register('duration', {
              required: {
                value: true,
                message: 'You must add the duartion of your song.',
              },
            })}
          />
          <Input
            name="label"
            label="Label"
            placeholder="one nice sentence about the song..."
            type="text"
            error={errors.label ? errors.label.message : false}
            register={register('label')}
          />

          <Select
            name="language"
            label="Language"
            error={errors.language ? errors.language.message : false}
            register={register('language', {
              required: {
                value: true,
                message: 'You must add the name of your song.',
              },
            })}
          >
            <option value="">Select Language</option>
            <option value="bangla">Bangla</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </Select>

        

          <Select
            name="contentType"
            label="Select Content Type"
            error={errors.contentType ? errors.contentType.message : false}
            register={register('contentType', {
              required: {
                value: true,
                message: 'You must select content type of the song.',
              },
            })}
          >
            <option value="MUSIC">MUSIC</option>
            <option value="AUDIOBOOK">AUDIOBOOK</option>
            <option value="PODCAST">PODCAST</option>
            <option value="POEM">POEM</option>
          </Select>

         
 

           <MultipleSelect
            name="genres"
            multiple={true}
            label="Select Genre of the song..."
            error={errors.genres ? errors.genres.message : false}
            register={register('genres', {
              required: {
                value: true,
                message: 'You must select genre of the song.',
              },
            })}
          >
              <option value="pop">Pop</option>
              <option value="rock">Rock</option>
              <option value="hiphop">Hip Hop</option>
              <option value="rnb">RnB</option>
              <option value="jazz">Jazz</option>
              <option value="country">Country</option>
              <option value="classical">Classical</option>
              <option value="metal">Metal</option>
              <option value="blues">Blues</option>
              <option value="folk">Folk</option>
              <option value="reggae">Reggae</option>
              <option value="punk">Punk</option>
              <option value="electronic">Electronic</option>
              <option value="dance">Dance</option>
              <option value="house">House</option>
              <option value="trance">Trance</option>
              <option value="techno">Techno</option>
              <option value="dubstep">Dubstep</option>
              <option value="drumnbass">Drum Bass</option>
              <option value="ambient">Ambient</option>
              <option value="chill">Chill</option>
              <option value="lounge">Lounge</option>
              <option value="trap">Trap</option>
              <option value="indie">Indie</option>
              <option value="alternative">Alternative</option>
              <option value="grunge">Grunge</option>
              <option value="psychedelic">Psychedelic</option>
              <option value="experimental">Experimental</option>
              <option value="funk">Funk</option>
              <option value="soul">Soul</option>
              <option value="disco">Disco</option>
              <option value="gospel">Gospel</option>
              <option value="christian">Christian</option>
              <option value="instrumental">Instrumental</option>
              <option value="soundtrack">Soundtrack</option>
              <option value="kpop">Kpop</option>
              <option value="jpop">Jpop</option>
              <option value="anime">Anime</option>
              <option value="game">Game</option>
              <option value="other">Other</option>
              <option value="adhunik-bangla">Adhunik</option>
              <option value="rabindra-sangeet">Rabindra</option>
              <option value="nazrul-geeti">Nazrul Geeti</option>
              <option value="bangla-folk">Bangla Folk</option>
              <option value="bangla-rock">Bangla Rock</option>
              <option value="bangla-pop">Bangla Pop</option>
              <option value="bangla-hip-hop">Bangla HipHop</option>
              <option value="bangla-classical">Bangla Classical</option>
              <option value="bangla-baul">Bangla Baul</option>
              <option value="bangla-bhawaiya">Bangla Bhawaiya</option>
              <option value="bangla-jari">Bangla Jari</option>
              <option value="bangla-sari">Bangla Sari</option>
              <option value="bangla-lalon">Bangla Lalon</option>
              <option value="bangla-adhunik">Bangla Adhunik</option>
              <option value="bangla-modern">Bangla Modern</option>
              <option value="bangla-fusion">Bangla Fusion</option>
              <option value="bangla-band">Bangla Band</option>
          </MultipleSelect>

           
        </FormSection>
      <FormSection title={'Artist Info'}>

        
      <div className=' outline-1 border-2  rounded-xl p-3'>
       <div className='flex items-center '>
        <label className='w-1/5'>Search</label>
         <input
            className='w-3/5 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-200'
            name="search"
            label="Search Artist or Bands"
            placeholder="Shironamhin"
            type="textarea"
            value={search2} 
            onChange={(e) => setSearch2(e.target.value)}
          />
          <button   onClick={() => {
            setSearch2('') 
          }} type="button" className="w-1/5">
            Clear
          </button>

         </div>
          <MultipleSelect
            multiple={true}
            name="primaryArtists"
            label="Select Primary Artists"
            placeholder="Linkon D Costa"
            error={errors.primaryArtists ? errors.primaryArtists.message : false}
            register={register('primaryArtists')}
          >
             {
                artists2?.map((artist) => (
                  <option key={artist.slug} value={artist.slug}>
                      {artist.name}
                  </option>
                ))
             }
            
          </MultipleSelect>

          </div>


          <div className=' outline-1 my-2 border-2 rounded-xl p-3'>
        <div className='flex items-center '>
        <label className='w-1/5'>Search</label>
         <input
            className='w-3/5 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-200'
            name="search"
            label="Search Artist or Bands"
            placeholder="Shironamhin"
            type="textarea"
            value={search3} 
            onChange={(e) => setSearch3(e.target.value)}
          />
          <button   onClick={() => {
            setSearch3('') 
          }} type="button" className="w-1/5">
            Clear
          </button>

         </div>

          <MultipleSelect
            multiple={true}
            name="featuredArtists"
            label="Select Featured Artist"
            placeholder="Jahangir Hossain"
            error={errors.featuredArtists ? errors.featuredArtists.message : false}
            register={register('featuredArtists')} 
          >
             {
                artists3?.map((artist) => (
                  <option key={artist.slug} value={artist.slug}>
                      {artist.name}
                  </option>
                ))
             }
            
          </MultipleSelect>

          </div>
       

          <div className=' outline-1 border-2 rounded-xl p-3'>
<div className='flex items-center '>
        <label className='w-1/5'>Album: </label>
         <input
            className='w-3/5 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-200'
            name="search"
            label="Search Albums"
            placeholder="Onnosomy"
            type="textarea"
            value={search1} 
            onChange={(e) => setSearch1(e.target.value)}
          />
          <button   onClick={() => {
            setSearch1('') 
          }} type="button" className="w-1/5">
            Clear
          </button>

         </div>
          
          <Select
            name="albumSlug"
            label="Select Album"
            error={errors.albumSlug ? errors.albumSlug.message : false}
            register={register('albumSlug', {
              required: {
                value: true,
                message: 'You must add the name of your song.',
              },
            })}
          >
            
            {
                albums?.map((album) => (
                  <option key={album.slug} value={album.slug}>
                      {album.name}
                  </option>
                ))
            }
          </Select>

          </div>
        

         
      </FormSection>
      <FormSection title={'Media Info'}>



      <div className="flex flex-col gap-4">
                <label htmlFor="urlFile">Upload content audio </label> 
                
                <input
                  id="urlFile"
                  name="urlFile"
                  type="file"
                  accept="audio/*"
                  {...register('urlFile', {
                    required: {
                      value: false,
                      message: 'You must select an audio to upload.',
                    },
                  })}
                />

                {errors.urlFile && <p>{errors.urlFile.message}</p>}

                {/* Hidden Input to store the Image URL after upload */}
                <input
                  type="hidden"
                  {...register('url')}
                />

                {
                    defaultValues?.url || watch('url') ? (
                    <audio className="w-1/2" src={watch('url') || defaultValues?.url} controls/> 
                  ) : null 
                }
            </div>

      {/* <Input
            name="url"
            label="Song URL (Must)"
            placeholder="cdn.spotify.com/..."
            type="text"
            error={errors.url ? errors.url.message : false}
            register={register('url', {
              required: {
                value: true,
                message: 'You must add the URL of your song.',
              },
            })}
          /> */}


      <RadioSelect
            name="hasLyrics"
            label="Has Lyrics ?"
            defaultValues={false}
            register={register('hasLyrics')}
            error={errors.hasLyrics ? errors.hasLyrics.message : false}
          />

          <Input
            name="copyright"
            label="Copy Right (optional)"
            placeholder="Enter copy right of the song..."
            type="text"
            error={errors.copyright ? errors.copyright.message : false}
            register={register('copyright')}
          />
         
          <Input
            name="downloadUrls"
            label="Download URL of the song (optional)"
            placeholder="Use comma to separate multiple URLs..."
            type="text"
            error={errors.downloadUrls ? errors.downloadUrls.message : false}
            register={register('downloadUrls')}
          />

          <Input
            name="origin"
            label="Origin"
            placeholder="Local or Foreign..."
            type="text"
            error={errors.origin ? errors.origin.message : false}
            register={register('origin' )}
          />


          <Input
            name="tags"
            label="Tags (optional)"
            placeholder="Use comma to separate multiple tags..."
            type="text"
            error={errors.tags ? errors.tags.message : false}
            register={register('tags')}
          />

          <Input
            name="mood"
            label="Mood of Listen (optional)"
            placeholder=" Enter mood of the song... "
            type="text"
            error={errors.mood ? errors.mood.message : false}
            register={register('mood')}
          />


       Lyrics Snippet
       <textarea
  className="form-control h-20 block w-full border border-solid bg-white bg-clip-padding px-4 py-2 font-normal text-gray-700 focus:ring-2"
  name="lyricsSnippet"
  placeholder="Lyrics snippet of the song..."
  {...register('lyricsSnippet')}
  style={{ height: "500px" }} // Directly setting the height using inline styles
/>
          <Input
            name="mediaPreviewUrl"
            label="Media Preview URL"
            placeholder="Media preview URL of the song..."
            type="text"
            error={
              errors.mediaPreviewUrl ? errors.mediaPreviewUrl.message : false
            }
            register={register('mediaPreviewUrl')}
          />

          <Input
            name="permaUrl"
            label="Perma URL !"
            placeholder="Perma URL of the song..."
            type="text"
            error={errors.permaUrl ? errors.permaUrl.message : false}
            register={register('permaUrl')}
          />

        

        <div className="flex flex-col items-center justify-center md:flex-row md:space-x-2">


            <RadioSelect
              className="w-full border-b border-gray-300 md:w-1/2 md:border-b-0 md:border-r-2"
              name="kbps320"
              label="Kbps320?"
              register={register('kbps320')}
              error={errors.kbps320 ? errors.kbps320.message : false}
            />

             <RadioSelect
              className="w-full border-b border-gray-300 md:w-1/2 md:border-b-0 md:border-r-2"
              name="isDolbyContent"
              label="Kbps320?"
              register={register('isDolbyContent')}
              error={errors.isDolbyContent ? errors.isDolbyContent.message : false}
            />
          </div>
      </FormSection>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Song` : 'Submit'}
      </Button>
    </div>
  )
}

export default SongForm
