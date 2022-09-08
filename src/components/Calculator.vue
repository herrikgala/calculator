<script setup>
import { onMounted, ref } from 'vue'
import UDropdown from './uDropdown.vue'
import UInput from './uInput.vue'
import { getConversionRate } from '../services/getConversionRate'
import eur from '../assets/eur.svg'
import usd from '../assets/usd.svg'
import btc from '../assets/btc.svg'
import eth from '../assets/eth.svg'
import { computed } from 'vue'
import { numberWithSpaces, defineDecimals } from '../helpers'

const currencyList = [
  { name: 'usd', icon: usd, default: 1000 },
  { name: 'eur', icon: eur, default: 1000 },
  { name: 'btc', icon: btc, default: 1 },
  { name: 'eth', icon: eth, default: 1 },
]
//  Essential variables 🐱‍👤
const fromOpened = ref(false)
const toOpened = ref(false)

const fromCurrency = ref(currencyList[0].name)
const toCurrency = ref(currencyList[2].name)

const fromValue = ref(String(currencyList[0].default))
const toValue = ref('')

let conversionRate = ref({ conversion_rate: 0, conversion_rate_usd: 0 })
// onMounted
onMounted(async () => {
  window.addEventListener('click', () => {
    if (fromOpened.value || toOpened.value) {
      fromOpened.value = false
      toOpened.value = false
    } else {
      return
    }
  })
  const { data } = await getConversionRate(fromCurrency.value, toCurrency.value)
  conversionRate.value = data
  handleChange('from', fromValue.value)
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
  // если совпадает с уже имеющейся валютой просто меняю местами 🥝
  if (name === fromCurrency.value || name === toCurrency.value) {
    if (text === 'from') {
      toCurrency.value = fromCurrency.value
      fromCurrency.value = name
      //   ставлю дефолтное значение для валюты
      fromValue.value = String(currencyList.find((el) => fromCurrency.value === el.name).default)
    } else {
      fromCurrency.value = toCurrency.value
      toCurrency.value = name
    }
    const { data } = await getConversionRate(fromCurrency.value, toCurrency.value)
    conversionRate.value = data
    handleChange('from', fromValue.value)
  } // если не совпадает то тупо ставлю что есть 🥝
  else {
    if (text === 'from') {
      fromCurrency.value = name
      fromValue.value = String(currencyList.find((el) => fromCurrency.value === el.name).default)
    } else {
      toCurrency.value = name
    }

    const { data } = await getConversionRate(fromCurrency.value, toCurrency.value)
    conversionRate.value = data
    handleChange('from', fromValue.value)
  }
}
// Input logic 🍉

const rate = computed(() => {
  let output = fromValue.value * conversionRate.value.conversion_rate_usd
  output = Math.ceil(output * (1 + 0.01) * 100) / 100
  output = numberWithSpaces(output)
  return output
})

function handleChange(text, e) {
  const value = parseFloat(e)
  if (isNaN(value)) return
  if (text === 'from') {
    fromValue.value = String(value)
    toValue.value = numberWithSpaces((value * conversionRate.value.conversion_rate).toFixed(defineDecimals(toCurrency.value)))
  } else {
    toValue.value = String(value)
    fromValue.value = numberWithSpaces((value / conversionRate.value.conversion_rate).toFixed(defineDecimals(fromCurrency.value)))
  }
}
</script>

<template>
  <div class="container">
    <div class="topLine"></div>
    <div class="clientText">
      <label for="">Amount i have</label>
      <span style="margin-left: auto; opacity: 0.8; font-size: 16px">{{ `${fromValue} ${fromCurrency.toUpperCase()}` }}</span>
    </div>
    <div class="interactive">
      <UDropdown
        :currency-list="currencyList"
        :is-opened="fromOpened"
        :active="fromCurrency"
        @toggle="handleToggle('from')"
        @select="(name) => handleSelect(name, 'from')"
      />
      <UInput autofocus :value="fromValue" @change="(e) => handleChange('from', e)" />
    </div>
    <div class="clientText">I need</div>
    <div class="interactive">
      <UDropdown
        :currency-list="currencyList"
        :is-opened="toOpened"
        :active="toCurrency"
        @toggle="handleToggle('to')"
        @select="(name) => handleSelect(name, 'to')"
      />
      <UInput :value="toValue" @change="(e) => handleChange('to', e)" />
    </div>
    <div class="rate">
      <label for="" style="font-size: 24px">Rate:</label>
      <span style="margin-left: auto">${{ rate }}</span>
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
