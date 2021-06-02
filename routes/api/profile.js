const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const axios = require('axios')
const config = require('config')
const normalize = require('normalize-url')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

const auth = require('../../middleware/auth')

// @route   GET api/profile/me
// @des     Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      res.status(400).json({ msg: 'Ada Kesalahan untuk user ini' })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   POST api/profile/
// @des     Create or Update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Harap isi statusmu').not().isEmpty(),
      check('skills', 'Harap isi kemampuanmu').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body

    // Build profile object
    const profileFields = {
      user: req.user.id,
      company,
      location,
      website: website === '' ? '' : normalize(website, { forceHttps: true }),
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()),
      status,
      githubusername,
    }

    // Build social object and add to profileFields
    const socialField = { youtube, twitter, instagram, linkedin, facebook }

    for (const [key, value] of Object.entries(socialField)) {
      if (value.length > 0) {
        socialField[key] = normalize(value, { forceHttps: true })
      }
    }
    profileFields.social = socialField

    try {
      // Using upsert option (creates new doc if no match is found)
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      )
      return res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route   GET api/profile
// @des     Get all profile
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   GET api/profile/user/:user_id
// @des     Get all profile by user_id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) return res.status(400).json({ msg: 'Profil tidak ditemukan' })

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId')
      return res.status(400).json({ msg: 'Profil tidak ditemukan' })
    res.status(500).send('Server Error')
  }
})

// @route   DELETE api/profile
// @des     Get profile, user, post
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // remove user posts
    await Post.deleteMany({ user: req.user.id })
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id })
    res.json({ msg: 'User telah dihapus' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   PUT api/profile/experience
// @des     Add profile experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title diperlukan').not().isEmpty(),
      check('company', 'Company diperlukan').not().isEmpty(),
      check('from', 'From date diperlukan').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, company, location, from, to, current, description } =
      req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.experience.unshift(newExp)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route   DELETE api/profile/experience/:exp_id
// @des     Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   PUT api/profile/education
// @des     Add profile education
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School diperlukan').not().isEmpty(),
      check('degree', 'Degree diperlukan').not().isEmpty(),
      check('fieldofstudy', 'Penjurusan diperlukan').not().isEmpty(),
      check('from', 'From date diperlukan').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.education.unshift(newEdu)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route   DELETE api/profile/education/:edu_id
// @des     Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   GET api/profile/github/:username
// @des     Delete user repos from Github
// @access  Public
router.get('/github/:username', async (req, res) => {
  try {
    const url = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    )

    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`,
    }

    const githubResponse = await axios.get(url, { headers })

    return res.json(githubResponse.data)
  } catch (err) {
    console.error(err.message)
    return res.status(404).json({ msg: 'Profil Github tidak ditemukan' })
  }
})

module.exports = router
