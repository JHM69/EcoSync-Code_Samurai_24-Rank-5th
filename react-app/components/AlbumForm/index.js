import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import { MultipleSelect } from '../common/MultipleSelect'
import RadioSelect from '../common/RadioSelect'
import { uploadImage } from '../../utils/upload'
import FormSection from '../common/Section' 
import { getBaseUrl } from '../../utils/url'
import axios from 'axios'

const AlbumForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm()

  const [artists1 , setArtists1] = useState([]);
  const [artists2 , setArtists2] = useState([]);
  const [artists3 , setArtists3] = useState([]);

  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [search3, setSearch3] = useState('');

  useEffect(() => {
    
    axios.get(getBaseUrl()+`/artists?search=`+search1).then((res) => { 
      setArtists1(res.data.artists) 
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
    //reset()
  })

  useEffect(() => {
    if (defaultValues) {
      setValue('name', defaultValues.name) 
      setValue('coverImage', defaultValues.coverImage)
      setValue('releaseDate', new Date(defaultValues?.releaseDate)?.toISOString().split('T')[0])
      setValue('duration', defaultValues.duration)
      setValue('label', defaultValues.label)
      setValue('language', defaultValues.language)
      setValue('contentType', defaultValues.contentType)
      setValue('genres', defaultValues.genres?.map((genre) => genre.slug))
      setValue('isPremium', defaultValues.isPremium ? 'true' : 'false')
      setValue('price', defaultValues.price)
      setValue('currency', defaultValues.currency)
      setValue('trillerAvailable', defaultValues.trillerAvailable? 'true' : 'false')
      setValue('trillerUrl', defaultValues.trillerUrl)
      setValue('mainArtistSlug', defaultValues.mainArtistSlug)
      setValue('primaryArtists', defaultValues.primaryArtists?.map((artist) => artist.slug) )
      setValue('featuredArtists', defaultValues.featuredArtists?.map((artist) => artist.slug) )
    
    }
  }, [defaultValues, setValue])

 
  const coverImageFile = watch("coverImageFile");

// This useEffect handles the file upload when a new file is selected
useEffect(() => {
  if (coverImageFile && coverImageFile.length > 0) {
    const file = coverImageFile[0];
    uploadImage(file).then(fileUrl => {
      // Assuming the uploadImage function returns the URL of the uploaded image
      setValue('coverImage', fileUrl); // Update the form's coverImage field with the uploaded image URL
    }).catch(error => {
      console.error("Error uploading image:", error);
    });
  }
}, [coverImageFile, setValue]);


  return (
    <div {...props} className="flex flex-col space-y-6">
      <form>
        <FormSection defaultOpen={true} title={'Album Information'}>
          <Input
            name="name"
            label="Name of the Album"
            placeholder="Oniket Prantor"
            type="text"
            error={errors.name ? errors.name.message : false}
            register={register('name', {
              required: {
                value: true,
                message: 'You must add the name of your album.',
              },
            })}
          />



             <div className="flex flex-col gap-4">
                <label htmlFor="coverImageFile">Upload artist Image: </label> 
                
                <input
                  id="coverImageFile"
                  name="coverImageFile"
                  type="file"
                  accept="image/*"
                  {...register('coverImageFile', {
                    required: {
                      value: false,
                      message: 'You must select an image to upload.',
                    },
                  })}
                />

                {errors.coverImageFile && <p>{errors.coverImageFile.message}</p>}

                {/* Hidden Input to store the Image URL after upload */}
                <input
                  type="hidden"
                  {...register('coverImage')}
                />

                {
                    defaultValues?.coverImage || watch('coverImage') ? (
                    <img
                      className="w-1/2"
                      src={watch('coverImage') || defaultValues?.coverImage}
                      alt="Cover Image"
                    />
                  ) : null
                }

            </div>

            



         <Input
            name="coverImage"
            label="Cover URL"
            placeholder=""
            type="text"
            error={errors.coverImage ? errors.coverImage.message : false}
            register={register('coverImage', {
              required: {
                value: true,
                message: 'You must add a cover.',
              },
            })}
          />



          <Input
            name="releaseDate"
            label="Publish Date (optional)"
            placeholder="2012"
            type="date"
            error={errors.releaseDate ? errors.releaseDate.message : false}
            register={register('releaseDate')}
          />
          <Input
            name="duration"
            label="Duration of the album"
            placeholder="Duration of the album..."
            type="number"
            error={errors.duration ? errors.duration.message : false}
            register={register('duration', {
              required: {
                value: true,
                message: 'You must add the duartion of your album.',
              },
            })}
          />
          <Input
            name="label"
            label="Label"
            placeholder="one nice sentence about the album..."
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
                message: 'You must add the name of your album.',
              },
            })}
          >
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
                message: 'You must select content type of the album.',
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
            label="Select Genre of the album..."
            error={errors.genres ? errors.genres.message : false}
            register={register('genres', {
              required: {
                value: true,
                message: 'You must select genre of the album.',
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
     </form>

      <FormSection title={'Artist'}>

      <div className=' outline-1 border-2 rounded-xl p-3'>
<div className='flex items-center '>
        <label className='w-1/5'>Search</label>
         <input
            className='w-3/5 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-200'
            name="search"
            label="Search Artist or Bands"
            placeholder="Shironamhin"
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
            name="mainArtistSlug"
            label="Select Main Artist"
            placeholder="Artcell"
            error={errors.mainArtistSlug ? errors.mainArtistSlug.message : false}
            register={register('mainArtistSlug', {
              required: {
                value: true,
                message: 'You must select Primary artist.',
              },
            })}
          >
             {
                artists1?.map((artist) => (
                  <option key={artist.slug} value={artist.slug}>
                      {artist.name}
                  </option>
                ))
             }
            
          </Select>



         
</div>

          <div className=' outline-1 border-2 my-2 rounded-xl p-3'>
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


          <div className=' outline-1 border-2 rounded-xl p-3'>
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
       











        </FormSection>
      
      <FormSection title={'More Info'}>
          <RadioSelect
            name="isPremium"
            label="Is Premium?"
            register={register('isPremium')}
            error={errors.isPremium ? errors.isPremium.message : false}
          />

                      {
                        watch('isPremium') === 'true' && (
                          <div className='flex flex-row gap-4'>
                            <Input
                            name="price"
                            label="Price"
                            placeholder="1200"
                            type="number"
                            error={
                              errors.price
                                ? errors.price.message
                                : false
                            }
                            register={register('price')}
                          />
                          <Select 
                          name="currency"
                          label="Currency"
                          error={errors.currency ? errors.currency.message : false}
                          register={register('currency')}
                        >
                          <option value="BDT">BDT</option>
                          <option value="USD">USD</option>
                          <option value="INR">INR</option>
                          <option value="EUR">EUR</option>
                          <option value="CAD">CAD</option>
                          <option value="JPY">JPY</option>
                        </Select>
                          </div>
                        )
                      }

              <RadioSelect
                name="trillerAvailable"
                label="Triller Available?"
                register={register('trillerAvailable')}
                error={errors.trillerAvailable ? errors.trillerAvailable.message : false}
              />

              {
                        watch('trillerAvailable') === 'true' && (
                          <div className='flex flex-row'>
                            <Input
                            name="trillerUrl"
                            label="Triller URL"
                            placeholder="https://www.youtube.com/watch?v=9bZkp7q19f0"
                            type="text"
                            error={
                              errors.trillerUrl
                                ? errors.trillerUrl.message
                                : false
                            }
                            register={register('trillerUrl')}
                          />
                          </div>
                        )
                      

              }

              
   
      </FormSection>
      
      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Album` : 'Submit'}
      </Button>
    </div>
  )
}

export default AlbumForm
