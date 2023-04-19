/**
 * baiduTranslator
 * @author  Yee
 * @date    2023/4/17
 * @desc    百度翻译
 * @link    https://fanyi-api.baidu.com/product/11
 */
import CryptoJS from 'crypto-js'
import chalk from 'chalk'
import ora from 'ora'
import { BaiduTargetKey, ResultTargetKey } from '~/server/utils/types'
import { info } from '~/server/utils/log'

interface Trans_result$1 {
  src: string
  dst: string
}

interface BaiduTranslateResponse {
  from: string
  to: string
  trans_result: Array< Trans_result$1 >
  error_code: string
  error_msg: string
}

const TargetKeyMap: Record<ResultTargetKey, BaiduTargetKey> = {
  [ResultTargetKey.EN]: BaiduTargetKey.EN,
  [ResultTargetKey.ZH_HK]: BaiduTargetKey.CHT,
  [ResultTargetKey.KO]: BaiduTargetKey.KO,
  [ResultTargetKey.VI]: BaiduTargetKey.VI,
  [ResultTargetKey.RU]: BaiduTargetKey.RU
}

const API_URL = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
const appid = process.env.NUXT_BAIDU_APP_ID
const key = process.env.NUXT_BAIDU_APP_KEY

const spinner = ora()
const startSpinner = (): void => {
  spinner.start('Start Translate')
  spinner.color = 'yellow'
  spinner.text = 'Baidu Translating...'
}
const stopSpinner = (data: any, isSuccess = true): void => {
  if (isSuccess) {
    spinner.succeed('TencentTranslator Successfully')
    console.log(data)
  } else {
    spinner.fail('TencentTranslator Failed')
    console.error('error', data)
  }
}

const waitOneSecond = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

/**
 * 单文本多语言翻译
 * @param textSource
 * @param targets
 */
export const startMultipleTargetBaiduTranslate = async (textSource = '', targets: ResultTargetKey[]):Promise<{ [key in ResultTargetKey]?: string }> => {
  const result: { [key in ResultTargetKey]?: string } = {}
  info(chalk.blue.bold('翻译: ') + chalk.bold(textSource))
  startSpinner()
  // 普通版api，并发请求只能1秒一次
  const length = targets.length
  let count = 0
  const getResult = async () => {
    const query = textSource
    const salt = (new Date()).getTime()
    const from = 'zh'
    const to = TargetKeyMap[targets[count]]
    const str1 = appid + query + salt + key
    const sign = CryptoJS.MD5(str1).toString()
    const response = await $fetch<BaiduTranslateResponse>(API_URL, {
      method: 'get',
      query: {
        q: query,
        appid,
        salt,
        from,
        to,
        sign
      }
    })
    console.log(response)
    result[targets[count]] = response.trans_result[0].dst
    count++
    await waitOneSecond()
    if (count < length) {
      await getResult()
    }
  }
  await getResult()
  stopSpinner(result)
  return result as { [key in ResultTargetKey]: string }
}
