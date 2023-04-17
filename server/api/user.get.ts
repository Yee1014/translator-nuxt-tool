/**
 * [id].get
 * @author  Yee
 * @date    2023/4/14
 * @desc
 */

export default defineEventHandler((event) => {
  const query = getQuery(event)
  console.log('[api] /user', query)
  return `User profile! By ${query?.id}`
})
