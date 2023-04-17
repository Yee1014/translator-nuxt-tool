<!--
 * index
 * @author  Yee
 * @date    2023/4/14
 * @desc
-->
<template>
  <div class="translator-page">
    <NTip class="justify-center" :n="isError ? 'red6 dark:red5' : ''" :icon="isError ? 'carbon:warning-alt' : 'carbon:warning'">
      Translate {{ isError ? isError : '' }}
    </NTip>
    <div class="m-auto max-w-6xl p-8 flex gap-6">
      <div class="flex-1">
        <div>翻译文案：</div>
        <NTextInput
          v-model="sourceText"
          class="mb-2"
          placeholder="请输入翻译的内容"
        />
        <div>翻译为：</div>
        <div class="flex items-center gap-3 mb-2">
          <NCheckbox
            v-for="t in targetKeyOptions"
            :key="t.value"
            v-model="t.checked"
            n="sky6"
            :disabled="isLoading"
          >
            {{ t.label }}
          </NCheckbox>
        </div>
        <NButton :disabled="isLoading" @click="handleTranslate">
          翻译
        </NButton>
      </div>
      <div class="flex-1">
        <div>翻译结果：</div>
        <div
          class="n-bg-base n-border-base border rounded h-xl px-2 py-1"
          :class="{'text-gray': !translateData}"
          style="white-space: pre;"
        >
          {{ translateData || '...' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLoading = ref<boolean>(false)
const translateData = ref<string>('')
const sourceText = ref<string>('')
const targetKeyOptions = ref([
  { label: '英语', value: 'en', checked: true },
  { label: '繁体', value: 'zh-TW', checked: false },
  { label: '韩语', value: 'ko', checked: false },
  { label: '越南语', value: 'vi', checked: false },
  { label: '俄语', value: 'ru', checked: false }
])
const isError = ref('')

async function handleTranslate () {
  isError.value = ''
  if (!sourceText.value) {
    isError.value = 'error: 填写内容！'
    return
  }
  const targets = targetKeyOptions.value.filter(i => i.checked).map(i => i.value)
  if (!targets.length) {
    isError.value = 'error: 请选择翻译语种！'
    return
  }
  isLoading.value = true
  try {
    translateData.value = await $fetch(
      '/api/translate',
      {
        method: 'post',
        body: {
          source: sourceText.value,
          targets
        }
      }
    )
    isLoading.value = false
  } catch (e) {
    isLoading.value = false
    isError.value = 'error'
  }
}
</script>

<style scoped lang="scss">

</style>
