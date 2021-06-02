import api from '../utils/api'
import { setAlert } from './alert'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types'

// LOAD USER
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth')

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

//REGISTER USER
export const register = (FormData) => async (dispatch) => {
  try {
    const res = await api.post('/users', FormData)

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({ type: REGISTER_FAIL })
  }
}

//LOGIN USER
export const login = (email, password) => async (dispatch) => {
  const body = { email, password }

  try {
    const res = await api.post('/auth', body)

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({ type: LOGIN_FAIL })
  }
}

// LOGOUT / CLEAR PROFILE
export const logout = () => ({ type: LOGOUT })
