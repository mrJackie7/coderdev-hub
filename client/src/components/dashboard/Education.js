import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import formatDate from '../../utils/formatDate'
import { connect } from 'react-redux'
import { deleteEducation } from '../../actions/profile'

const Education = ({ education, deleteEducation }) => {
  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className='hide-sm'>{edu.degree}</td>
      <td className='hide-sm'>
        {formatDate(edu.from)} - {edu.to ? formatDate(edu.to) : 'Sekarang'}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(edu._id)}
          className='btn btn-danger'
        >
          Hapus
        </button>
      </td>
    </tr>
  ))

  return (
    <Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Sekolah</th>
            <th className='hide-sm'>Gelar</th>
            <th className='hide-sm'>Tahun</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  )
}

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
}

export default connect(null, { deleteEducation })(Education)
