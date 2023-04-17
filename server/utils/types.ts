/**
 * types
 * @author  Yee
 * @date    2023/4/17
 * @desc
 */

/**
 * 结果返回的key
 * 自约束的值格式
 */
export enum ResultTargetKey {
  EN = 'en-US',
  ZH_TW = 'zh-HK',
  KO = 'ko-KR',
  VI = 'vi-VN',
  RU = 'ru-RU'
}

/**
 * 腾讯翻译的key
 * @link  https://cloud.tencent.com/document/api/551/15619
 */
export enum TenTargetKey {
  EN = 'en',
  ZH_TW = 'zh-TW',
  KO = 'ko',
  VI = 'vi',
  RU = 'ru'
}

/**
 * 阿里翻译的key
 * @link  https://help.aliyun.com/document_detail/215387.html?spm=a2c4g.158269.0.0.10782e50F7spi1
 */
export enum ALiTargetKey {
  EN = 'en',
  ZH_TW = 'zh-tw',
  KO = 'ko',
  VI = 'vi',
  RU = 'ru'
}
