/**
 * hello
 * @author  Yee
 * @date    2023/4/14
 * @desc
 */
export default defineEventHandler(() => {
  console.log('[api] /hello')
  return {
    api: 'works'
    // env: process.env.NUXT_API_SECRET,
    // id: process.env.NUXT_TENCENT_SECRET_ID,
    // key: process.env.NUXT_TENCENT_SECRET_KEY
  }
})
