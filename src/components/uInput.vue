<script setup>
import { toRefs, useAttrs } from 'vue'
const props = defineProps({
  value: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change'])
const attrs = useAttrs()
const { value } = toRefs(props)

function preventTypingText(e) {
  if (isNaN(Number(e.key)) && e.keyCode !== 46) {
    e.preventDefault()
  }
}
</script>

<template>
  <div>
    <input type="text" v-bind="attrs" :value="value" @input="emit('change')" @keypress="preventTypingText" />
  </div>
</template>

<style scoped>
input {
  width: 100%;
  border: none;
  border-bottom: 2px solid var(--secondColor);
  height: 100%;
  outline: none;
  padding: 4px;
  font-size: 16px;
  background-color: var(--firstColor);
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
}
</style>
