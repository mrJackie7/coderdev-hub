import api from '../utils/api'
import { setAlert } from './alert'

import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
} from './types'

// GET CURRENT USERS PROFILE
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/profile/me')

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// GET ALL PROFILES
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE })

  try {
    const res = await api.get('/profile')

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// GET PROFILE BY ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/profile/user/${userId}`)

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// GET GITHUB REPOS
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await api.get(`/profile/github/${username}`)

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// CREATE OR UPDATE PROFILE
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const res = await api.post('/profile', formData, config)

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })

      dispatch(
        setAlert(
          edit ? 'Profil Telah Diubah' : 'Profil telah dibuat',
          'success'
        )
      )

      if (!edit) {
        history.push('/dashboard')
      }
    } catch (err) {
      const errors = err.response.data.errors

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      })
    }
  }

// ADD EXPERIENCE
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const res = await api.put('/profile/experience', formData, config)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Pengalaman telah ditambahkan', 'success'))

    history.push('/dashboard')
  } catch (err) {
    const errors = err.response.data.errors

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// ADD EDUCATION
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const res = await api.put('/profile/education', formData, config)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Pendidikan telah ditambahkan', 'success'))

    history.push('/dashboard')
  } catch (err) {
    const errors = err.response.data.errors

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// DELETE EXPERIENCE
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profile/experience/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Pengalaman telah dihapus', 'success'))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// DELETE EDUCATION
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profile/education/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Pendidikan telah dihapus', 'success'))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// DELETE ACCOUNT AND PROFILE
export const deleteAccount = () => async (dispatch) => {
  if (
    window.confirm(
      'Apakah anda sudah yakin? Perintah ini TIDAK BISA dibatalkan!'
    )
  ) {
    try {
      await api.delete(`/profile`)

      dispatch({
        type: CLEAR_PROFILE,
      })
      dispatch({
        type: ACCOUNT_DELETED,
      })

      dispatch(
        setAlert(
          'Akun anda telah dihapus secara permanen. Terimakasih sudah menjadi bagian dari CoderDev Hub'
        )
      )
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      })
    }
  }
}
