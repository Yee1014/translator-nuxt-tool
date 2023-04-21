<!--
 * web
 * @author  Yee
 * @date    2023/4/21
 * @desc    使用浏览器翻译
-->
<template>
  <div>
    <header>
      <div class="logo-tip">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo">
        </a>
        <span>&emsp;+&emsp;</span>
        <a href="https://vuejs.org/" target="_blank">
          <img src="/vue.svg" class="logo vue" alt="Vue logo">
        </a>
        <div class="tip-hover">
          <img src="/translate-tip.gif" alt="">
        </div>
      </div>
      <div>
        翻译
      </div>

      <div style="flex: 1" />
      <div class="percent">
        {{ showPercentText }}
      </div>
    </header>
    <main class="px-2">
      <div class="form p-4 border rounded">
        <div>操作：</div>
        <div class="flex flex-wrap items-center gap-3 mb-2">
          <NButton :disabled="isTranslating" @click="previewFile">
            读取json
            <input
              ref="inputRef"
              class="preview-file"
              type="file"
              @change="handleSelectFile"
            >
          </NButton>
          <NButton :disabled="isTranslating" @click="handleSaveFile">
            保存json
          </NButton>
        </div>
        <div>json数据格式：</div>
        <NSwitch v-model="isMultipleFormat" class="mb-2" n="sky6 dark:sky5" :disabled="isTranslating">
          多语言格式
        </NSwitch>
        <div>扫描间隔：</div>
        <select v-model="translateDelay" class="border rounded mb-2" :disabled="isTranslating">
          <option :value="1000">
            <code>1s</code>
          </option>
          <option :value="1500">
            <code>1.5s</code>
          </option>
          <option :value="2000">
            <code>2s</code>
          </option>
        </select>
        <template
          v-if="!isMultipleFormat"
        >
          <div>保存为：</div>
          <NTextInput
            v-model="saveFileName"
            placeholder="语言国际码(zh-CN)"
            :disabled="isTranslating"
          />
        </template>
      </div>
      <div class="json-data">
        <div v-for="(keyObj, kIdx) in keyList" :key="kIdx" class="key-map">
          <pre :data-key="keyObj.key">
          <code class="key">"{{ keyObj.key }}":&nbsp;</code>
          </pre>
          <span class="value">{{ keyObj.locales }}</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import numbro from 'numbro'
import { saveAs } from 'file-saver'
import all from '@/assets/json/all.json'
import zhCN from '@/assets/json/zh-CN.json'

type LocalesObj = {
  [key: string]: string | LocalesObj
}

type LocalesKey = {
  key: string
  locales: string | object
}

type AllFormatObj = {
  [key: string]: Record<string, string>
}

const dataRes = ref<LocalesObj | AllFormatObj>(zhCN)

const getSingleKeyObjList = () => {
  const keyObjList: LocalesKey[] = []
  /**
   * 铺平
   * @param obj
   * @param parentKey
   */
  const flatObject = (obj: LocalesObj, parentKey = '') => {
    const keys = Object.keys(obj)
    keys.forEach((key) => {
      const flatKey = parentKey ? `${parentKey}.${key}` : key
      if (typeof obj[key] === 'string') {
        keyObjList.push({
          key: flatKey,
          locales: obj[key]
        })
      } else if (typeof obj[key] === 'object') {
        flatObject(obj[key] as LocalesObj, flatKey)
      }
    })
  }
  flatObject(dataRes.value)
  return keyObjList
}

const getMultipleKeyObjList = () => {
  const keyObjList: LocalesKey[] = []
  const keys = Object.keys(dataRes.value)
  keys.forEach((key) => {
    keyObjList.push({ key, locales: dataRes.value[key]['zh-CN'] })
  })
  return keyObjList
}

const keyList = computed(() => {
  return isMultipleFormat.value ? getMultipleKeyObjList() : getSingleKeyObjList()
})

const translateDelay = ref<number>(1500)
const saveFileName = ref<string>('')
const isTranslating = ref<boolean>(false)
const isMultipleFormat = ref<boolean>(false)
const translatePercent = ref<number>(0)
const showPercentText = computed<string>(() =>
  numbro(translatePercent.value).format({ output: 'percent', mantissa: 1 })
)

const inputRef = shallowRef<HTMLInputElement>()

watch(() => isMultipleFormat.value, (val) => {
  if (val) {
    dataRes.value = all
  } else {
    dataRes.value = zhCN
  }
})

const previewFile = () => {
  inputRef.value?.click()
}

/**
 * 单语言格式
 */
const saveDataToFile = async () => {
  await getTranslateData()
  const keyMapElementList = document.querySelectorAll('.key-map')
  const blobData: any = {}
  const setDeepObject = (keyNested: string, value: string) => {
    const keyList = keyNested.split('.')
    const keyDepth = keyList.length - 1
    let item = blobData

    for (let i = 0; i < keyList.length; i++) {
      if (i === keyDepth) {
        item[keyList[i]] = value
      }
      if (item[keyList[i]] === undefined) {
        item[keyList[i]] = {}
      }
      item = item[keyList[i]]
    }
  }
  keyMapElementList.forEach((element) => {
    // 获取层级key
    const keyNested = element.getElementsByTagName('pre')[0].dataset
      .key as string
    // 放置value
    const objValue = element.getElementsByClassName('value')[0].innerText
    setDeepObject(keyNested, objValue)
  })
  const blob = new Blob([JSON.stringify(blobData)], {
    type: 'text/plain;charset=utf-8'
  })
  saveAs(blob, `${saveFileName.value || 'zh-CN'}.json`)
  setTimeout(() => {
    const body = document.documentElement
    body.scrollTop = 0
  }, translateDelay.value)
}

/**
 * 多语言格式
 */
const saveDataMultipleToFile = async () => {
  await getTranslateData()
  const keyMapElementList = document.querySelectorAll('.key-map')
  const blobData: any = all
  const locale = saveFileName.value || 'zh-CN'
  keyMapElementList.forEach((element) => {
    const key = element.getElementsByTagName('pre')[0].dataset
      .key as string
    const value = element.getElementsByClassName('value')[0].innerText
    if (blobData[key] === undefined) {
      blobData[key] = {}
    }
    blobData[key][locale] = value
  })
  const blob = new Blob([JSON.stringify(blobData)], {
    type: 'text/plain;charset=utf-8'
  })
  saveAs(blob, 'all.json')
  setTimeout(() => {
    const body = document.documentElement
    body.scrollTop = 0
  }, translateDelay.value)
}

const handleSaveFile = () => {
  if (isMultipleFormat.value) {
    saveDataMultipleToFile()
  } else {
    if (!saveFileName.value) {
      alert('请输入语言国际码(zh-CN)')
      return
    }
    saveDataToFile()
  }
}

/**
 * 滚动翻译
 */
const getTranslateData = () => {
  if (isTranslating.value) { return Promise.reject(new Error('正在翻译')) }
  return new Promise((resolve) => {
    isTranslating.value = true
    translatePercent.value = 0

    const body = document.documentElement
    body.scrollTop = 0

    const timer = setInterval(() => {
      const pageHeight = body.clientHeight
      const endScrollTop = body.offsetHeight - pageHeight
      body.scrollTop = body.scrollTop + pageHeight
      translatePercent.value = body.scrollTop / endScrollTop
      if (body.scrollTop >= endScrollTop) {
        clearInterval(timer)
        isTranslating.value = false
        translatePercent.value = 1
        setTimeout(() => {
          resolve(true)
        }, translateDelay.value)
      }
    }, translateDelay.value)
  })
}

const handleSelectFile = (e: any) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = (loadEvent: any) => {
    const jsonStr = loadEvent.target.result as string
    dataRes.value = JSON.parse(jsonStr)
  }
  reader.readAsText(file, 'utf8')
}
</script>

<style scoped lang="scss">
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: white;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px #e5e5e5;
  z-index: 2;

  &:hover {
    .logo-tip .tip-hover {
      display: block;
    }
  }

  .logo-tip {
    padding: 0 2em;
    position: relative;
    display: flex;
    align-items: center;

    .tip-hover {
      display: none;
      position: absolute;
      top: 75px;
      left: 20px;
      padding: 5px;
      box-shadow: 0 0 1px 2px #d6d6d6;
      border-radius: 2px;
      background: white;
      z-index: 2;

      img {
        max-width: none;
      }
    }
  }

  .logo {
    height: 2em;
    //padding: 1.5em;
    will-change: filter;
  }

  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }

  .percent {
    padding-right: 10px;
    font-size: 40px;
  }
}

main {
  margin-top: 85px;

  .form {
    position: fixed;
    top: 85px;
    left: 6px;
    z-index: 1;
    width: 20vw;
    .preview-file {
      width: 0;
      height: 0;
    }
  }

  .json-data {
    padding-left: calc(20vw + 10px);
  }

  .key-map {
    text-align: left;
    display: flex;
    align-items: center;
    font-size: 12px;

    pre {
      margin: 0;
      display: inline;
      white-space: normal;
    }

    .key {
      font-weight: bold;
      color: #42b883;
    }
    .value {
      color: #646cff;
    }
  }
}
</style>
