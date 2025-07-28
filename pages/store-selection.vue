<script lang="ts">
import Vue from 'vue'

interface Store {
  id: string
  name: string
  address: string
  hours: string
  features: string[]
  distance: string
}

export default Vue.extend({
  head() {
    return {
      title: '店舗選択 - 予約システム',
      script: [
        {
          innerHTML: "window.clarity('set', 'pageID', 'store-selection');"
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'clarity-page': ['innerHTML']
      }
    }
  },

  data() {
    return {
      selectedStore: null as string | null,
      stores: [
        {
          id: 'shibuya',
          name: '渋谷店',
          address: '東京都渋谷区渋谷1-1-1',
          hours: '10:00-22:00',
          features: ['駅直結', 'Wi-Fi完備', '個室あり'],
          distance: '駅から徒歩1分'
        },
        {
          id: 'shinjuku',
          name: '新宿店',
          address: '東京都新宿区新宿2-2-2',
          hours: '9:00-23:00',
          features: ['24時間営業', '駐車場完備', 'テラス席'],
          distance: '駅から徒歩3分'
        },
        {
          id: 'harajuku',
          name: '原宿店',
          address: '東京都渋谷区神宮前3-3-3',
          hours: '11:00-21:00',
          features: ['インスタ映え', 'カフェ併設', 'ペット可'],
          distance: '駅から徒歩5分'
        },
        {
          id: 'ginza',
          name: '銀座店',
          address: '東京都中央区銀座4-4-4',
          hours: '10:00-20:00',
          features: ['高級感', '完全予約制', 'VIP室'],
          distance: '駅から徒歩2分'
        },
        {
          id: 'akasaka',
          name: '赤坂店',
          address: '東京都港区赤坂5-5-5',
          hours: '8:00-22:00',
          features: ['朝営業', '会議室完備', 'ビジネス向け'],
          distance: '駅から徒歩4分'
        },
        {
          id: 'omotesando',
          name: '表参道店',
          address: '東京都港区北青山6-6-6',
          hours: '10:00-21:00',
          features: ['デザイナーズ', 'アート展示', '屋上庭園'],
          distance: '駅から徒歩6分'
        }
      ] as Store[]
    }
  },

  mounted() {
    this.trackPageLoad()
  },

  methods: {
    selectStore(storeId: string): void {
      this.selectedStore = storeId
      
      console.log('Store selected:', storeId)
      if (window.clarity) {
        window.clarity('event', 'store_selected', { store: storeId })
      }
    },

    proceedToRegistration(): void {
      if (!this.selectedStore) {
        alert('店舗を選択してください')
        return
      }
      
      console.log('Proceeding to registration with store:', this.selectedStore)
      if (window.clarity) {
        window.clarity('event', 'proceed_to_registration', { selectedStore: this.selectedStore })
      }
      
      localStorage.setItem('selectedStore', this.selectedStore)
      this.$router.push('/member-registration')
    },

    trackPageLoad(): void {
      if (window.clarity) {
        window.clarity('event', 'store_selection_page_loaded')
      }
      console.log('Store selection page loaded')
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>🏪 店舗選択</h1>
      <p>ご希望の店舗をお選びください</p>
    </div>

    <div class="breadcrumb">
      <nuxt-link to="/">トップ</nuxt-link> > 店舗選択
    </div>

    <div class="store-grid">
      <div 
        v-for="store in stores" 
        :key="store.id"
        class="store-card" 
        :class="{ selected: selectedStore === store.id }"
        @click="selectStore(store.id)"
      >
        <div class="store-name">{{ store.name }}</div>
        <div class="store-address">{{ store.address }}</div>
        <div class="store-hours">営業時間: {{ store.hours }}</div>
        <div class="store-features">
          <span v-for="feature in store.features" :key="feature" class="feature-tag">{{ feature }}</span>
        </div>
        <div class="distance">{{ store.distance }}</div>
      </div>
    </div>

    <div class="button-group">
      <nuxt-link to="/" class="btn btn-primary">戻る</nuxt-link>
      <button class="btn btn-success" :disabled="!selectedStore" @click="proceedToRegistration">次へ進む</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border-radius: 10px;
  color: white;
}
.breadcrumb {
  margin-bottom: 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 14px;
  color: #666;
}
.breadcrumb a {
  color: #3498db;
  text-decoration: none;
}
.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 30px 0;
}
.store-card {
  background: white;
  border: 2px solid #eee;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.store-card:hover {
  transform: translateY(-5px);
  border-color: #3498db;
  box-shadow: 0 5px 20px rgba(52, 152, 219, 0.2);
}
.store-card.selected {
  border-color: #2ecc71;
  background: #f8fff8;
}
.store-name {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}
.store-address {
  color: #666;
  margin-bottom: 10px;
}
.store-hours {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}
.store-features {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
.feature-tag {
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}
.distance {
  font-weight: bold;
  color: #e74c3c;
}
.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}
.btn-primary {
  background: #3498db;
  color: white;
}
.btn-success {
  background: #2ecc71;
  color: white;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
.btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}
.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}
</style>