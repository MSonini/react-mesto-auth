
// const BASE_API_URL = process.env.BASE_API_URL || 'https://mesto.nomoreparties.co/v1/cohort-54'
// const AUTH_BASE_URL = process.env.AUTH_BASE_URL || 'https://auth.nomoreparties.co'
// const AUTH_KEY = process.env.AUTH_KEY || 'ad02f25c-8ecc-4315-97b8-cf739e1d74e3'
const BASE_API_URL = 'http://localhost:3001'
const AUTH_BASE_URL = 'http://localhost:3001'
const AUTH_KEY = 'ad02f25c-8ecc-4315-97b8-cf739e1d74e3'
console.log(BASE_API_URL, AUTH_BASE_URL, AUTH_KEY)

const PAGES = {
  login: '/sign-in',
  register: '/sign-up',
  index: '/',
};

export { BASE_API_URL, AUTH_KEY, AUTH_BASE_URL, PAGES };
