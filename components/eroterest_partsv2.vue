
<template>
  <div id="eroterest_partsv2" class="eroterest_partsv2"></div>
</template>

<script setup lang="ts">
onMounted(() => {
  const targetDiv = document.getElementById('eroterest_partsv2')
  if (targetDiv) {
    const script = document.createElement('script')
    script.src =
      '//bpm.eroterest.net/v2/?w=&e=&n=9&rn=3&spn=&sprn=&fc=&ts=0&tp=0&tbg=&tsz=&tr=&tc=&tmc=&tu=1&is=1&mts=&ds=&dsz=&dr=&dc=&df=&ibg=&ibm=&ids=&ib=&ibc=&ir=&sf='
    script.async = true

    targetDiv.appendChild(script) // `#eroterest_partsv2` の中に追加
  }
})
</script>
