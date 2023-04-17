<!--
 * test
 * @author  Yee
 * @date    2023/4/14
 * @desc
-->
<template>
  <div>
    <h1>Index page</h1>
    <div>
      <button @click="handleFetch">
        fetch
      </button>
      {{ fetchData }}
    </div>
    <div>
      <button @click="handleUser">
        users
      </button>
      {{ userData }}
    </div>
    <div>
      <button @click="handleList">
        list
      </button>
      {{ listData }}
    </div>
    <div>
      <button @click="handleTranslate">
        translate
      </button>
      {{ translateData }}
    </div>
  </div>
</template>

<script setup lang="ts">
const fetchData = ref()

function handleFetch () {
  useFetch('/api/hello', {
    params: { name: 'hello' }
  }).then((res) => {
    fetchData.value = res.data
  })
}

const userData = ref()

function handleUser () {
  useFetch('/api/user', { params: { id: '123' } }).then((res) => {
    userData.value = res.data
  })
}

const listData = ref()

function handleList () {
  useFetch('/api/list/1').then((res) => {
    listData.value = res.data
  })
}

const translateData = ref()

function handleTranslate () {
  $fetch(
    '/api/translate',
    {
      method: 'post',
      body: { source: '恭喜发财' }
    }
  )
    .then((res) => {
      translateData.value = res
    })
}
</script>

<style scoped lang="scss">

</style>
