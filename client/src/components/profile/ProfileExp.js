import React from 'react'
import PropTypes from 'prop-types'
import formatDate from '../../utils/formatDate'

const ProfileExp = ({
  experience: { company, title, location, current, to, from, description },
}) => (
  <div>
    <h3 className='text-dark'>{company}</h3>
    <p>
      {formatDate(from)} - {to ? formatDate(to) : 'Sekarang'}
    </p>
    <p>
      <strong>Posisi: </strong> {title}
    </p>
    <p>
      <strong>Deskripsi: </strong> {description}
    </p>
  </div>
)

ProfileExp.propTypes = {
  experience: PropTypes.object.isRequired,
}

export default ProfileExp
