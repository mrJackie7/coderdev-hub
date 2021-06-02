const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const normalize = require('normalize-url')

const User = require('../../models/User')

// @route   POST api/users
// @des     Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Nama Diperlukan').not().isEmpty(),
    check('email', 'Harap masukan email yang valid').isEmail(),
    check(
      'password',
      'Harap masukan password dengan 6 atau lebih karakter'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Pengguna sudah ada' }] })
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        }),
        { forceHttps: true }
      )

      user = new User({
        name,
        email,
        avatar,
        password,
      })

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

module.exports = router
