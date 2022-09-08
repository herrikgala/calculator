<script setup>
import { onMounted, ref } from 'vue'
import UDropdown from './uDropdown.vue'
import UInput from './uInput.vue'
import { getConversionRate } from '../services/getConversionRate'
import eur from '../assets/eur.svg'
import usd from '../assets/usd.svg'
import btc from '../assets/btc.svg'
import eth from '../assets/eth.svg'

// hashmap {name:image}
const currencyList = [
  { name: 'usd', icon: usd, default: 100 },
  { name: 'eur', icon: eur, default: 100 },
  { name: 'btc', icon: btc, default: 1 },
  { name: 'eth', icon: eth, default: 1 },
]
const fromOpened = ref(false)
const toOpened = ref(false)

const from = ref(currencyList[0].name)
const to = ref(currencyList[1].name)
let conversionRate = ref({ conversion_rate: 0, conversion_rate_usd: 0 })

onMounted(async () => {
  window.addEventListener('click', () => {
    if (fromOpened.value || toOpened.value) {
      fromOpened.value = false
      toOpened.value = false
    } else {
      return
    }
  })
  const { data } = await getConversionRate(from.value, to.value)
  conversionRate.value = data
  handleChange(conversionRate.value)
})
// Dropdown logic 🎃
function handleToggle(text) {
  if (text === 'from') {
    fromOpened.value = !fromOpened.value
    // на всякий закрываю другой список если он открыт
    toOpened.value ? (toOpened.value = false) : null
  } else {
    toOpened.value = !toOpened.value
    // на всякий закрываю другой список если он открыт
    fromOpened.value ? (fromOpened.value = false) : null
  }
}

async function handleSelect(name, text) {
  // если совпадает с уже имеющейся валютой просто меняю местами
  if (name === from.value || name === to.value) {
    if (text === 'from') {
      to.value = from.value
      from.value = name
    } else {
      from.value = to.value
      to.value = name
    }
  } else {
    if (text === 'from') from.value = name
    else to.value = name
  }

  const { data } = await getConversionRate(from.value, to.value)
  conversionRate.value = data
}
// Input logic 🍉
const fromValue = ref('1')
const toValue = ref('2')

function handleChange(text) {
  if (text === 'from') {
    //
  } else {
    //
  }
}
</script>

<template>
  <div class="container">
    <div class="topLine"></div>
    <div class="clientText">
      <label for="">Amount i have</label>
      <span style="margin-left: auto; opacity: 0.8; font-size: 16px">34 495 EUR</span>
    </div>
    <div class="interactive">
      <UDropdown
        :currency-list="currencyList"
        :is-opened="fromOpened"
        :active="from"
        @toggle="handleToggle('from')"
        @select="(name) => handleSelect(name, 'from')"
      />
      <UInput autofocus :value="fromValue" @change="handleChange('from')" />
    </div>
    <div class="clientText">I need</div>
    <div class="interactive">
      <UDropdown
        :currency-list="currencyList"
        :is-opened="toOpened"
        :active="to"
        @toggle="handleToggle('to')"
        @select="(name) => handleSelect(name, 'to')"
      />
      <UInput :value="toValue" @change="handleChange('to')" />
    </div>
    <div class="rate">
      <label for="" style="font-size: 24px">Rate:</label>
      <span style="margin-left: auto">$42 950.50</span>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 600px;
  height: 400px;
  background-color: #0f3460;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.514);
}

.container > div:not(:first-child) {
  margin: 7px;
}
.topLine {
  position: absolute;
  width: 100%;
  height: 2px;
  left: 0;
  top: 0;
  background-color: var(--secondColor);
}

.clientText {
  height: 40px;
  width: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 24px;
}

.rate {
  height: 50px;
  background-color: var(--secondColor);
  width: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
}
.interactive {
  height: 40px;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.interactive > div {
  height: 100%;
}

.interactive > :first-child {
  width: 72%;
  border-bottom: 1px solid var(--secondColor);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.interactive > :nth-child(2) {
  width: 23%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
