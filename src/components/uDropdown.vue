<script setup>
import chevron from '../assets/chevron.svg'
import { toRefs } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  currencyList: {
    type: Array,
    required: true,
  },
  isOpened: Boolean,
  active: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['toggle', 'select'])
// в списке не должно быть уже выбранной валюты
const filteredCurrencyList = computed(() => props.currencyList.filter((el) => el.name !== props.active))
const { isOpened } = toRefs(props)
</script>

<template>
  <div @click.stop="emit('toggle')">
    <img :src="currencyList.find((el) => el.name === active)?.icon" alt="currnecyIcon" style="width: 20px; margin: 5px" draggable="false" />
    <span>{{ active.toUpperCase() }}</span>
    <img :src="chevron" alt="" srcset="" style="width: 20px; margin: 5px; transition: 0.2s" :class="{ opened: isOpened }" />
    <ul v-if="isOpened" class="currencyList">
      <li v-for="currency in filteredCurrencyList" :key="currency.name" @click="emit('select', currency.name)">
        <img :src="currency.icon" alt="currnecyIcon" style="width: 20px; margin: 5px" draggable="false" />
        <span>{{ currency.name.toUpperCase() }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.currencyList {
  position: absolute;
  top: 100%;
  width: 140px;
  height: auto;
  background-color: var(--firstColor);
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
  z-index: 1;
}

.currencyList > li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  opacity: 0.8;
}

.currencyList > li:hover {
  opacity: 1;
}
.opened {
  transform: rotate(180deg);
}
</style>
