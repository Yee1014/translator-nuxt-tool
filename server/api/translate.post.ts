/**
 * translate
 * @author  Yee
 * @date    2023/4/14
 * @desc
 */
import { startMultipleTargetTranslate } from '~/server/utils/tencentTranslator'
import { startMultipleTargetAliTranslate } from '~/server/utils/aliTranslator'
import { startMultipleTargetBaiduTranslate } from '~/server/utils/baiduTranslator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('[api] /translate', body)
  if (body.translator === 'ali') {
    return await startMultipleTargetAliTranslate(body.source, body.targets)
  } else if (body.translator === 'baidu') {
    return await startMultipleTargetBaiduTranslate(body.source, body.targets)
  } else if (body.translator === 'tencent') {
    return await startMultipleTargetTranslate(body.source, body.targets)
  }
})
