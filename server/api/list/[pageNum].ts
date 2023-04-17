/**
 * [pageNum].ts
 * @author  Yee
 * @date    2023/4/14
 * @desc
 */
export default defineEventHandler((event) => {
  console.log('[api] /list/', event.context.params?.pageNum)
  return [{ name: 'Yee' }]
})
