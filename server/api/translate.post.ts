/**
 * translate
 * @author  Yee
 * @date    2023/4/14
 * @desc
 */
import { startMultipleTargetTranslate } from '~/server/utils/tencentTranslator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('[api] /translate', body)
  return await startMultipleTargetTranslate(body.source, body.targets)
})
