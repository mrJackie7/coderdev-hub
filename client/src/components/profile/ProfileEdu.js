import React from 'react'
import PropTypes from 'prop-types'
import formatDate from '../../utils/formatDate'

const ProfileEdu = ({
  education: { school, degree, fieldofstudy, current, to, from, description },
}) => (
  <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
      {formatDate(from)} - {to ? formatDate(to) : 'Sekarang'}
    </p>
    <p>
      <strong>Gelar: </strong> {degree}
    </p>
    <p>
      <strong>Jurusan: </strong> {fieldofstudy}
    </p>
    <p>
      <strong>Deskripsi: </strong> {description}
    </p>
  </div>
)

ProfileEdu.propTypes = {
  education: PropTypes.object.isRequired,
}

export default ProfileEdu
