<script lang="ts">
import Vue from 'vue'

interface RegistrationForm {
  lastName: string
  firstName: string
  lastNameKana: string
  firstNameKana: string
  email: string
  phone: string
  birthdate: string
  gender: string
  postalCode: string
  prefecture: string
  city: string
  address: string
  occupation: string
  interests: string[]
  howDidYouHear: string
  specialRequests: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

export default Vue.extend({
  head() {
    return {
      title: '登録内容確認 - 予約システム',
      script: [
        {
          innerHTML: "window.clarity('set', 'pageID', 'confirmation');"
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'clarity-page': ['innerHTML']
      }
    }
  },

  data() {
    return {
      selectedStoreName: '',
      form: {
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        email: '',
        phone: '',
        birthdate: '',
        gender: '',
        postalCode: '',
        prefecture: '',
        city: '',
        address: '',
        occupation: '',
        interests: [],
        howDidYouHear: '',
        specialRequests: '',
        agreeToTerms: false,
        subscribeNewsletter: false
      } as RegistrationForm
    }
  },

  mounted() {
    this.loadData()
    this.trackPageLoad()
  },

  methods: {
    loadData(): void {
      const registrationData = localStorage.getItem('registrationData')
      if (registrationData) {
        this.form = JSON.parse(registrationData)
      } else {
        this.$router.push('/member-registration')
        return
      }

      const selectedStore = localStorage.getItem('selectedStore')
      if (selectedStore) {
        const storeNames: { [key: string]: string } = {
          'shibuya': '渋谷店',
          'shinjuku': '新宿店',
          'harajuku': '原宿店',
          'ginza': '銀座店',
          'akasaka': '赤坂店',
          'omotesando': '表参道店'
        }
        this.selectedStoreName = storeNames[selectedStore] || selectedStore
      }
    },

    formatDate(dateString: string): string {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    getGenderLabel(gender: string): string {
      const labels: { [key: string]: string } = {
        'male': '男性',
        'female': '女性',
        'other': 'その他',
        'prefer-not-to-say': '回答しない'
      }
      return labels[gender] || gender
    },

    getOccupationLabel(occupation: string): string {
      const labels: { [key: string]: string } = {
        'student': '学生',
        'office-worker': '会社員',
        'public-servant': '公務員',
        'self-employed': '自営業',
        'freelance': 'フリーランス',
        'homemaker': '主婦・主夫',
        'retired': '無職・退職',
        'other': 'その他'
      }
      return labels[occupation] || occupation
    },

    getInterestLabel(interest: string): string {
      const labels: { [key: string]: string } = {
        'technology': 'テクノロジー',
        'business': 'ビジネス',
        'design': 'デザイン',
        'marketing': 'マーケティング',
        'health': '健康・ウェルネス',
        'education': '教育',
        'entertainment': 'エンターテイメント',
        'travel': '旅行',
        'food': '料理・グルメ',
        'sports': 'スポーツ',
        'arts': 'アート・文化',
        'finance': '金融・投資'
      }
      return labels[interest] || interest
    },

    getHowDidYouHearLabel(source: string): string {
      const labels: { [key: string]: string } = {
        'web-search': 'ウェブ検索',
        'social-media': 'SNS',
        'friend-referral': '友人の紹介',
        'advertisement': '広告',
        'news-media': 'ニュース・メディア',
        'other': 'その他'
      }
      return labels[source] || source
    },

    submitRegistration(): void {
      console.log('Final registration submitted')
      
      if (window.clarity) {
        window.clarity('event', 'final_registration_submitted', {
          selectedStore: localStorage.getItem('selectedStore'),
          hasNewsletter: this.form.subscribeNewsletter,
          interestCount: this.form.interests.length
        })
      }
      
      this.$router.push('/completion')
    },

    trackPageLoad(): void {
      if (window.clarity) {
        window.clarity('event', 'confirmation_page_loaded')
      }
      console.log('Confirmation page loaded')
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>✅ 登録内容確認</h1>
      <p>入力内容をご確認ください</p>
    </div>

    <div class="breadcrumb">
      <nuxt-link to="/">トップ</nuxt-link> > 
      <nuxt-link to="/store-selection">店舗選択</nuxt-link> > 
      <nuxt-link to="/member-registration">会員登録</nuxt-link> > 確認
    </div>

    <div v-if="selectedStoreName" class="selected-store">
      <strong>選択された店舗:</strong> {{ selectedStoreName }}
    </div>

    <div class="confirmation-section">
      <h3>基本情報</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>お名前</label>
          <div class="value">{{ form.lastName }} {{ form.firstName }}</div>
        </div>
        <div class="info-item">
          <label>お名前（カナ）</label>
          <div class="value">{{ form.lastNameKana }} {{ form.firstNameKana }}</div>
        </div>
        <div class="info-item">
          <label>メールアドレス</label>
          <div class="value">{{ form.email }}</div>
        </div>
        <div class="info-item">
          <label>電話番号</label>
          <div class="value">{{ form.phone }}</div>
        </div>
        <div v-if="form.birthdate" class="info-item">
          <label>生年月日</label>
          <div class="value">{{ formatDate(form.birthdate) }}</div>
        </div>
        <div v-if="form.gender" class="info-item">
          <label>性別</label>
          <div class="value">{{ getGenderLabel(form.gender) }}</div>
        </div>
      </div>

      <h3>住所情報</h3>
      <div class="info-grid">
        <div v-if="form.postalCode" class="info-item">
          <label>郵便番号</label>
          <div class="value">{{ form.postalCode }}</div>
        </div>
        <div v-if="form.prefecture" class="info-item">
          <label>都道府県</label>
          <div class="value">{{ form.prefecture }}</div>
        </div>
        <div v-if="form.city" class="info-item">
          <label>市区町村</label>
          <div class="value">{{ form.city }}</div>
        </div>
        <div v-if="form.address" class="info-item">
          <label>番地・建物名</label>
          <div class="value">{{ form.address }}</div>
        </div>
      </div>

      <h3>その他</h3>
      <div class="info-grid">
        <div v-if="form.occupation" class="info-item">
          <label>職業</label>
          <div class="value">{{ getOccupationLabel(form.occupation) }}</div>
        </div>
        <div v-if="form.interests && form.interests.length > 0" class="info-item">
          <label>興味のある分野</label>
          <div class="value">
            <div class="interest-tags">
              <span v-for="interest in form.interests" :key="interest" class="interest-tag">
                {{ getInterestLabel(interest) }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="form.howDidYouHear" class="info-item">
          <label>当サービスを知ったきっかけ</label>
          <div class="value">{{ getHowDidYouHearLabel(form.howDidYouHear) }}</div>
        </div>
        <div v-if="form.specialRequests" class="info-item">
          <label>特別なご要望・アレルギー等</label>
          <div class="value">{{ form.specialRequests }}</div>
        </div>
      </div>

      <h3>同意事項</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>利用規約とプライバシーポリシー</label>
          <div class="value">{{ form.agreeToTerms ? '同意する' : '同意しない' }}</div>
        </div>
        <div class="info-item">
          <label>メールマガジン</label>
          <div class="value">{{ form.subscribeNewsletter ? '受け取る' : '受け取らない' }}</div>
        </div>
      </div>
    </div>

    <div class="button-group">
      <nuxt-link to="/member-registration" class="btn btn-secondary">修正する</nuxt-link>
      <button @click="submitRegistration" class="btn btn-success">この内容で登録</button>
    </div>
  </div>
</template>

<style scoped>
import Vue from 'vue'

interface RegistrationForm {
  lastName: string
  firstName: string
  lastNameKana: string
  firstNameKana: string
  email: string
  phone: string
  birthdate: string
  gender: string
  postalCode: string
  prefecture: string
  city: string
  address: string
  occupation: string
  interests: string[]
  howDidYouHear: string
  specialRequests: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

export default Vue.extend({
  head() {
    return {
      title: '登録内容確認 - 予約システム',
      script: [
        {
          innerHTML: "window.clarity('set', 'pageID', 'confirmation');"
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'clarity-page': ['innerHTML']
      }
    }
  },

  data() {
    return {
      selectedStoreName: '',
      form: {
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        email: '',
        phone: '',
        birthdate: '',
        gender: '',
        postalCode: '',
        prefecture: '',
        city: '',
        address: '',
        occupation: '',
        interests: [],
        howDidYouHear: '',
        specialRequests: '',
        agreeToTerms: false,
        subscribeNewsletter: false
      } as RegistrationForm
    }
  },

  mounted() {
    this.loadData()
    this.trackPageLoad()
  },

  methods: {
    loadData(): void {
      // 登録データを読み込み
      const registrationData = localStorage.getItem('registrationData')
      if (registrationData) {
        this.form = JSON.parse(registrationData)
      } else {
        // データがない場合は登録ページに戻る
        this.$router.push('/member-registration')
        return
      }

      // 選択された店舗を読み込み
      const selectedStore = localStorage.getItem('selectedStore')
      if (selectedStore) {
        const storeNames: { [key: string]: string } = {
          'shibuya': '渋谷店',
          'shinjuku': '新宿店',
          'harajuku': '原宿店',
          'ginza': '銀座店',
          'akasaka': '赤坂店',
          'omotesando': '表参道店'
        }
        this.selectedStoreName = storeNames[selectedStore] || selectedStore
      }
    },

    formatDate(dateString: string): string {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    getGenderLabel(gender: string): string {
      const labels: { [key: string]: string } = {
        'male': '男性',
        'female': '女性',
        'other': 'その他',
        'prefer-not-to-say': '回答しない'
      }
      return labels[gender] || gender
    },

    getOccupationLabel(occupation: string): string {
      const labels: { [key: string]: string } = {
        'student': '学生',
        'office-worker': '会社員',
        'public-servant': '公務員',
        'self-employed': '自営業',
        'freelance': 'フリーランス',
        'homemaker': '主婦・主夫',
        'retired': '無職・退職',
        'other': 'その他'
      }
      return labels[occupation] || occupation
    },

    getInterestLabel(interest: string): string {
      const labels: { [key: string]: string } = {
        'technology': 'テクノロジー',
        'business': 'ビジネス',
        'design': 'デザイン',
        'marketing': 'マーケティング',
        'health': '健康・ウェルネス',
        'education': '教育',
        'entertainment': 'エンターテイメント',
        'travel': '旅行',
        'food': '料理・グルメ',
        'sports': 'スポーツ',
        'arts': 'アート・文化',
        'finance': '金融・投資'
      }
      return labels[interest] || interest
    },

    getHowDidYouHearLabel(source: string): string {
      const labels: { [key: string]: string } = {
        'web-search': 'ウェブ検索',
        'social-media': 'SNS',
        'friend-referral': '友人の紹介',
        'advertisement': '広告',
        'news-media': 'ニュース・メディア',
        'other': 'その他'
      }
      return labels[source] || source
    },

    submitRegistration(): void {
      console.log('Final registration submitted')
      
      if ((window as any).clarity) {
        (window as any).clarity('event', 'final_registration_submitted', {
          selectedStore: localStorage.getItem('selectedStore'),
          hasNewsletter: this.form.subscribeNewsletter,
          interestCount: this.form.interests.length
        })
      }
      
      // 完了ページへ遷移
      this.$router.push('/completion')
    },

    trackPageLoad(): void {
      if ((window as any).clarity) {
        (window as any).clarity('event', 'confirmation_page_loaded')
      }
      console.log('Confirmation page loaded')
    }
  }
})
</script>

<style scoped>
.container {
  max-width: 800px;
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
.selected-store {
  background: #e8f5e8;
  border: 1px solid #2ecc71;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 30px;
  text-align: center;
}
.confirmation-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  margin: 30px 0;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.info-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}
.info-item label {
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
  display: block;
}
.info-item .value {
  color: #2c3e50;
  font-size: 16px;
}
.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}
.interest-tag {
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
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
.btn-secondary {
  background: #95a5a6;
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
.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
}
h3 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>