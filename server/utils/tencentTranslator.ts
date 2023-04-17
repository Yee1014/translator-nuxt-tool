/**
 * tencentTranslator
 * @author  Yee
 * @date    2023/4/14
 * @desc    腾讯翻译
 * @link    https://cloud.tencent.com/product/tmt
 */
import * as TencentCloud from 'tencentcloud-sdk-nodejs'
import { type ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface'
import { type TextTranslateResponse, type TextTranslateRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_models'
import { type TextTranslateBatchRequest } from 'tencentcloud-sdk-nodejs/src/services/tmt/v20180321/tmt_models'
import ora from 'ora'
import chalk from 'chalk'
import { info } from './log'

const spinner = ora()
const startSpinner = (): void => {
  spinner.start('Start Translate')
  spinner.color = 'yellow'
  spinner.text = 'Tencent Translating...'
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

// 导入对应产品模块的client models。
const TmtClient = TencentCloud.tmt.v20180321.Client

const clientConfig: ClientConfig = {
  // 腾讯云认证信息
  // 为了保护密钥安全，建议将密钥设置在环境变量中或者配置文件中，请参考本文凭证管理章节。
  // 硬编码密钥到代码中有可能随代码泄露而暴露，有安全隐患，并不推荐。
  credential: {
    secretId: process.env.NUXT_TENCENT_SECRET_ID,
    secretKey: process.env.NUXT_TENCENT_SECRET_KEY
  },
  // 产品地域
  region: 'ap-shanghai',
  // 可选配置实例
  profile: {
    httpProfile: {
      endpoint: 'tmt.tencentcloudapi.com'
    }
  }
}

// 实例化要请求产品的client对象,clientProfile是可选的
const client = new TmtClient(clientConfig)

const projectId = parseInt(process.env.NUXT_TENCENT_PROJECT_ID || '0')

/**
 * 单一文本翻译
 */
export const startTranslate = (): void => {
  startSpinner()

  const params: TextTranslateRequest = {
    SourceText: '我是腾讯翻译',
    Source: 'zh',
    Target: 'en',
    ProjectId: projectId
  }
  client.TextTranslate(params).then(
    (data) => {
      stopSpinner(data)
    },
    (err) => {
      stopSpinner(err, false)
    }
  )
}

/**
 * 批量文本翻译
 * @param target
 * @param textSource
 */
export const startTranslateBatch = (target = 'en', textSource: string[] = []): void => {
  startSpinner()

  const params: TextTranslateBatchRequest = {
    Source: 'zh',
    Target: target,
    ProjectId: projectId,
    SourceTextList: textSource
  }
  client.TextTranslateBatch(params).then(
    (data) => {
      stopSpinner(data)
    },
    (err) => {
      stopSpinner(err, false)
    }
  )
}

// 结果返回的key
enum ResultTargetKey {
  EN = 'en-US',
  ZH_TW = 'zh-HK',
  KO = 'ko-KR',
  VI = 'vi-VN',
  RU = 'ru-RU'
}

// 腾讯翻译的key
export enum TargetKey {
  EN = 'en',
  ZH_TW = 'zh-TW',
  KO = 'ko',
  VI = 'vi',
  RU = 'ru'
}

const TargetKeyMap: Record<TargetKey, ResultTargetKey> = {
  [TargetKey.EN]: ResultTargetKey.EN,
  [TargetKey.ZH_TW]: ResultTargetKey.ZH_TW,
  [TargetKey.KO]: ResultTargetKey.KO,
  [TargetKey.VI]: ResultTargetKey.VI,
  [TargetKey.RU]: ResultTargetKey.RU
}

/**
 * 单文本多语言翻译
 * @param textSource
 * @param targets
 */
export const startMultipleTargetTranslate = async (textSource = '', targets: TargetKey[]): Promise<{ [key in ResultTargetKey]?: string }> => {
  const result: { [key in ResultTargetKey]?: string } = {}
  info(chalk.blue.bold('翻译: ') + chalk.bold(textSource))
  startSpinner()
  const promiseList: Array<Promise<TextTranslateResponse>> = []
  for (let i = 0; i < targets.length; i++) {
    const params: TextTranslateRequest = {
      SourceText: textSource,
      Source: 'zh',
      Target: targets[i],
      ProjectId: projectId
    }
    promiseList.push(client.TextTranslate(params))
  }
  const targetRes = await Promise.all(promiseList)
  targetRes.forEach((res) => {
    const key = res.Target as TargetKey
    result[TargetKeyMap[key]] = res.TargetText
  })
  stopSpinner(result)
  return result as { [key in ResultTargetKey]: string }
}

/*
startMultipleTargetTranslate(
  '恭喜发财!',
  [TargetKey.EN, TargetKey.ZH_TW, TargetKey.KO, TargetKey.VI, TargetKey.RU]
)
  .then(res => {
    stopSpinner(res)
  }).catch(err => {
    stopSpinner(err, false)
  })
*/
