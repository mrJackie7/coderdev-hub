import api from '../utils/api'
import { setAlert } from './alert'
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKE,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from './types'

// GET POSTS
export const getPosts = () => async (dispatch) => {
  try {
    const res = await api.get('/posts')

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// ADD LIKE
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/like/${id}`)

    dispatch({
      type: UPDATE_LIKE,
      payload: { id, likes: res.data },
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// REMOVE LIKE
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/unlike/${id}`)

    dispatch({
      type: UPDATE_LIKE,
      payload: { id, likes: res.data },
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// DELETE POST
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.delete(`/posts/${id}`)

    dispatch({
      type: DELETE_POST,
      payload: id,
    })

    dispatch(setAlert('Postinganmu berhasil dihapus', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// ADD POST
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/posts', formData)

    dispatch({
      type: ADD_POST,
      payload: res.data,
    })

    dispatch(setAlert('Postinganmu berhasil ditempel', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// GET POST
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/${id}`)

    dispatch({
      type: GET_POST,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// ADD COMMENT
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await api.post(`/posts/comment/${postId}`, formData)

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    })

    dispatch(setAlert('Komentarmu berhasil ditempel', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// DELETE COMMENT
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await api.delete(`/posts/comment/${postId}/${commentId}`)

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    })

    dispatch(setAlert('Komentarmu berhasil dihapus', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
