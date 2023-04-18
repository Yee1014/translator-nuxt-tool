/**
 * aliTranslator
 * @author  Yee
 * @date    2023/4/11
 * @desc    阿里翻译
 * @link    https://www.aliyun.com/product/ai/base_alimt
 */
import Alimt, * as $alimt20181012 from '@alicloud/alimt20181012'
import * as $OpenApi from '@alicloud/openapi-client'
import Util, * as $Util from '@alicloud/tea-util'
import Console from '@alicloud/tea-console'
import '@alicloud/tea-typescript'
import chalk from 'chalk'
import { ResultTargetKey, ALiTargetKey } from '~/server/utils/types'
import { info } from '~/server/utils/log'

const TargetKeyMap: Record<ResultTargetKey, ALiTargetKey> = {
  [ResultTargetKey.EN]: ALiTargetKey.EN,
  [ResultTargetKey.ZH_HK]: ALiTargetKey.ZH_TW,
  [ResultTargetKey.KO]: ALiTargetKey.KO,
  [ResultTargetKey.VI]: ALiTargetKey.VI,
  [ResultTargetKey.RU]: ALiTargetKey.RU
}

/**
 * 使用AK&SK初始化账号Client
 * @return Client
 * @throws Exception
 */
const createClient = (): Alimt => {
  const config = new $OpenApi.Config({
    // 必填，您的 AccessKey ID
    accessKeyId: process.env.NUXT_ALI_ACCESSKEY_ID,
    // 必填，您的 AccessKey Secret
    accessKeySecret: process.env.NUXT_ALI_ACCESSKEY_SECRET
  })
  // 访问的域名
  config.endpoint = 'mt.cn-hangzhou.aliyuncs.com'
  return new Alimt(config)
}

/**
 * 单文本多语言翻译
 * @param textSource
 * @param targets
 */
export const startMultipleTargetAliTranslate = async (textSource = '', targets: ResultTargetKey[]):Promise<{ [key in ResultTargetKey]?: string }> => {
  const result: { [key in ResultTargetKey]?: string } = {}
  info(chalk.blue.bold('翻译: ') + chalk.bold(textSource))
  const client = createClient()
  const promiseList: Array<Promise<$alimt20181012.TranslateGeneralResponse>> = []
  for (let i = 0; i < targets.length; i++) {
    const translateGeneralRequest = new $alimt20181012.TranslateGeneralRequest({
      formatType: 'test',
      sourceLanguage: 'zh',
      targetLanguage: TargetKeyMap[targets[i]],
      sourceText: textSource,
      scene: 'general'
    })
    const runtime = new $Util.RuntimeOptions({ })
    // spinner.start()
    // spinner.color = 'yellow'
    // spinner.text = 'Bing Translating...'
    promiseList.push(client.translateGeneralWithOptions(translateGeneralRequest, runtime))
  }
  const targetRes = await Promise.all(promiseList)
  targetRes.forEach((res, idx) => {
    const key = targets[idx]
    result[key] = res.TargetText
  })
  Console.log(Util.toJSONString(result))
  return result as { [key in ResultTargetKey]: string }
}
