import initializeBasicAuth from 'nextjs-basic-auth'
import { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } from 'constants/env'

const users = [
  {
    user: BASIC_AUTH_USER,
    password: BASIC_AUTH_PASSWORD,
  },
]

export const basicAuthCheck = initializeBasicAuth({
  users: users
})
