import React, { Fragment } from 'react'

const NotFound = () => {
  return (
    <Fragment>
      <h1 className='x-large text-primary'>
        <i className='fas fa-exclamation-triangle' /> Laman Tidak Ditemukan
      </h1>
      <p className='large'>
        Maaf, Halaman ini tidak ada <i class='far fa-sad-tear'></i>{' '}
      </p>
    </Fragment>
  )
}

export default NotFound
