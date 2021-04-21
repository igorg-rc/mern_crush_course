const { Router } = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const config = require('config')

const User = require('../models/User')

router.post('/register', 
  [
    check('email', 'Wrong email format').isEmail(),
    check('password', 'Password is minimum 6 characters in length')
      .isLength({ min: 6 })
  ],
  
  async (req, res) => {
  try {
    console.log(`Req body: ${JSON.stringify(req.body)}`)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: erros.array(),
        message: 'Invalid registration fields'
      })
    }

    const { email, password } = req.body
    // const email = req.body.email
    // const password = req.body.password
    
    const candidate = await User.findOne({ email })

    if (candidate) {
      return res.status(400).json({ message: 'User with such email is already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email, password: hashedPassword })

    await user.save()

    res.status(201).json({ message: 'User was created' })

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong! Server error. Registration failed!'})
  }
})

// /api/auth/login
router.post('/login', 
[
  check('email', 'Insert valid email').normalizeEmail().isEmail(),
  check('password', 'Insert password').exists()
],
async (req, res) => {
  try {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: erros.array(),
        message: 'Invalid login fields'
      })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).json({ message: 'User not found' })
    }
    
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password!' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user.id })

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong! Server error. Login failed!'})
  }
})

module.exports = router