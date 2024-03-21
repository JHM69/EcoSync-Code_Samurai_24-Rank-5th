import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import { MultipleSelect, OptionWithCheckbox } from '../common/MultipleSelect' 
import RadioSelect from '../common/RadioSelect'
import { getBaseUrl } from '../../utils/url'
import FormSection from '../common/Section'

import { uploadImage } from '../../utils/upload'

import axios from 'axios' 


const ArtistForm = ({ type, defaultValues, onFormSubmit, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm() 

  const [uploading, setUploading] = useState(false);
  
  const [artists , setArtists] = useState([]);

  const [search, setSearch] = useState('');

  useEffect(() => {
     
    if (defaultValues) {
      setValue('name', defaultValues.name) 
      setValue('primaryImage', defaultValues.primaryImage)
      setValue('bio', defaultValues.bio)
      setValue('creatorType', defaultValues.creatorType)
      setValue('genres', defaultValues?.genres?.map((genre) => genre.slug) || [] ) 
      setValue('fb', defaultValues.fb)
      setValue('twitter', defaultValues.twitter)
      setValue('wiki', defaultValues.wiki)
      setValue('dob', defaultValues.dob)
      setValue('dominantLanguage', defaultValues.dominantLanguage)
      setValue('isBand', defaultValues.isBand? 'true' : 'false')
      setValue('bandMembers', defaultValues.bandMembers.map((member) => member.slug))
    }
  }, [defaultValues, setValue]);


  const primaryImageFile = watch("primaryImageFile");

// This useEffect handles the file upload when a new file is selected
useEffect(() => {
  if (primaryImageFile && primaryImageFile.length > 0) {
    setUploading(true);
    const file = primaryImageFile[0];
    uploadImage(file).then(fileUrl => {
      setUploading(false);
      // Assuming the uploadImage function returns the URL of the uploaded image
      setValue('primaryImage', fileUrl); // Update the form's primaryImage field with the uploaded image URL
    }).catch(error => {
      setUploading(false);
      console.error("Error uploading image:", error);
    });
  }

}, [primaryImageFile, setValue]);

  useEffect(() => {
    
    axios.get(getBaseUrl()+`/artists?search=`+search).then((res) => { 
      setArtists(res.data.artists)
      }
      ).catch((err) => {
        console.log(err)
      })
   
}, [search]);

  

  const onSubmit = handleSubmit(async (data) => {
    console.log(data) 
    await onFormSubmit(data)
    //reset()
  })

  return (
    <div {...props} className="flex flex-col space-y-6">
      <form>
        <FormSection defaultOpen={true} title={'Artist Information'}>

        <Select
            name="creatorType"
            label="Creator Type"
            error={errors.creatorType ? errors.creatorType.message : false}
            register={register('creatorType', {
              required: {
                value: true,
                message: 'You must select the creator Type',
              },
            })}
          >
            <option value="MUSIC">MUSIC</option>
            <option value="AUDIOBOOK">AUDIOBOOK</option>
            <option value="PODCAST">PODCAST</option>
            <option value="POEM">POEM</option>
          </Select>




          <Input
            name="name"
            label="Name of the Artist"
            placeholder="Artcell..."
            type="text"
            error={errors.name ? errors.name.message : false}
            register={register('name', {
              required: {
                value: true,
                message: 'You must add the name of your artist.',
              },
            })}
          />

            <div className="flex flex-col gap-4">
                <label htmlFor="primaryImageFile">Upload artist Image: </label> 

                {
                  uploading ? (
                    <p>Uploading...</p>
                  ) : null
                }
                
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
                      src={watch('primaryImage') || defaultValues?.primaryImage }
                      alt="Primary Image"
                    />
                  ) : null
                }

            </div>

            
          <Input
            name="bio"
            label="Bio"
            placeholder="About the artist..."
            type="textarea"
            error={errors.bio ? errors.bio.message : false}
            register={register('bio')}
          />
           

          <MultipleSelect
            name="genres"
            multiple={true}
            label="Select Genre of the artist..."
            error={errors.genres ? errors.genres.message : false}
            register={register('genres', {
              required: {
                value: true,
                message: 'You must select genre of the artist.',
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
      <FormSection title={'More Info'}>
      <Input
            name="fb"
            label="Facebook Link (optional)"
            placeholder="Facebook Link"
            type="textarea"
            error={errors.fb ? errors.fb.message : false}
            register={register('fb')}
          />
 <Input
            name="dob"
            label="Birth Year"
            placeholder="2001"
            type="text"
            error={errors.dob ? errors.dob.message : false}
            register={register('dob')}
          /> 
<Input
            name="twitter"
            label="twitter (optional)"
            placeholder="twitter Link"
            type="textarea"
            error={errors.twitter ? errors.twitter.message : false}
            register={register('twitter')}
          />
           
        <Input
            name="wiki"
            label="details link (optional)"
            placeholder="wiki Link"
            type="textarea"
            error={errors.wiki ? errors.wiki.message : false}
            register={register('wiki')}
          />


          <Select
            name="dominantLanguage"
            label="Language"
            placeholder="Select Your Language"
            error={errors.dominantLanguage ? errors.dominantLanguage.message : false}
            register={register('dominantLanguage')}
          >
            
            <option value="bangla">Bangla</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </Select>

           
         
      </FormSection>
      <FormSection title={'Band Information'}>
          <RadioSelect
              className="w-full md:w-1/2"
              name="isBand"
              label="Is a Band or Group?"
              register={register('isBand')}
              error={
                errors.isBand ? errors.isBand.message : false
              }
            />
            
            {
             watch('isBand') === "true" ? (

<> 

         <div className='flex'>
         <input
            className='w-4/5 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-200'
            name="search"
            label="Search Members"
            placeholder="Jahangir Hossain..."
            type="textarea"
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            error={errors.search ? errors.search.message : false}
          />
          <button   onClick={() => {
            setSearch('') 
          }} type="button" className="w-1/5">
            Clear
          </button>

         </div>


            <MultipleSelect
              name="bandMembers"
              multiple={true}
              label="Select Members..."
              register={register('bandMembers')}
            >
             {
                artists?.map((artist) => (
                  <OptionWithCheckbox key={artist.slug} value={artist.slug}>
                      {artist.name}
                  </OptionWithCheckbox>
                ))
             }
            </MultipleSelect></>
              ) : null
            }

            {/* if isBand then select Band Members */}
           
      </FormSection>

      <Button type="button" onClick={onSubmit} className="w-full">
        {type ? `${type} Artist` : 'Submit'}
      </Button>
    </div>
  )
}

export default ArtistForm
