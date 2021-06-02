import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createProfile, getCurrentProfile } from '../../actions/profile'

const initialState = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubusername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: '',
}

const ProfileForm = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history,
}) => {
  const [formData, setFormData] = useState(initialState)
  const [displaySocialInputs, toggleSocialInputs] = useState(false)

  useEffect(() => {
    if (!profile) getCurrentProfile()
    if (!loading && profile) {
      const profileData = { ...initialState }
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key]
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key]
      }
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(',')
      setFormData(profileData)
    }
  }, [loading, getCurrentProfile, profile])

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
  } = formData

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    createProfile(formData, history, profile ? true : false)
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Atur Profilmu</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Tambahkan sedikit perubahan dalam profil
        anda
      </p>
      <small>* = Dibutuhkan</small>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <select name='status' value={status} onChange={onChange}>
            <option>* Pilih Status Profesionalmu Saat Ini</option>
            <option value='Developer'>Developer</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Pelajar atau Mahasiswa'>
              Pelajar atau Mahasiswa
            </option>
            <option value='Instruktor'>Instruktor, Guru atau Dosen</option>
            <option value='Magang'>Magang</option>
            <option value='Lainnya'>Lainnya</option>
          </select>
          <small className='form-text'>
            Beri kami sedikit gambaran tentang posisi anda sekarang dalam
            berkarir
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Perusahaan'
            name='company'
            value={company}
            onChange={onChange}
          />
          <small className='form-text'>
            Bisa Perusahaan anda sendiri atau perusahaan tempat anda bekerja
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Website'
            name='website'
            value={website}
            onChange={onChange}
          />
          <small className='form-text'>
            Bisa menggunakan website pribadi atau website perusahaan anda
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Lokasi'
            name='location'
            value={location}
            onChange={onChange}
          />
          <small className='form-text'>
            Kota dan wilayah disarnkan (contoh: Jakarta, Indonesia; Tangerang,
            Banten, Indonesia)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Skills'
            name='skills'
            value={skills}
            onChange={onChange}
          />
          <small className='form-text'>
            Tolong gunakan koma (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Github Username'
            name='githubusername'
            value={githubusername}
            onChange={onChange}
          />
          <small className='form-text'>
            Jika ingin memasukan repos terakhir dan link Github, sertakan juga
            username anda
          </small>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='A short bio of yourself'
            name='bio'
            value={bio}
            onChange={onChange}
          />
          <small className='form-text'>Beritahu kami tentang anda</small>
        </div>

        <div className='my-2'>
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type='button'
            className='btn btn-light'
          >
            Tambahkan Link Sosial Media
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x' />
              <input
                type='text'
                placeholder='Link Twitter'
                name='twitter'
                value={twitter}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x' />
              <input
                type='text'
                placeholder='Link Facebook'
                name='facebook'
                value={facebook}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x' />
              <input
                type='text'
                placeholder='Link YouTube'
                name='youtube'
                value={youtube}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-linkedin fa-2x' />
              <input
                type='text'
                placeholder='Link Linkedin'
                name='linkedin'
                value={linkedin}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x' />
              <input
                type='text'
                placeholder='Link Instagram'
                name='instagram'
                value={instagram}
                onChange={onChange}
              />
            </div>
          </Fragment>
        )}

        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Kembali
        </Link>
      </form>
    </Fragment>
  )
}

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  profile: state.profile,
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
)
