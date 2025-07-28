<script lang="ts">
import Vue from 'vue'

interface RegistrationForm {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  occupation: string;
  interests: string[];
  howDidYouHear: string;
  specialRequests: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

interface InterestOption {
  value: string;
  label: string;
}

export default Vue.extend({
  head() {
    return {
      title: '会員登録 - 予約システム',
      script: [
        {
          innerHTML: "window.clarity('set', 'pageID', 'member-registration');"
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
      } as RegistrationForm,
      prefectures: [
        '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
        '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
        '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
        '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
        '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
        '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
        '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
      ],
      interestOptions: [
        { value: 'technology', label: 'テクノロジー' },
        { value: 'business', label: 'ビジネス' },
        { value: 'design', label: 'デザイン' },
        { value: 'marketing', label: 'マーケティング' },
        { value: 'health', label: '健康・ウェルネス' },
        { value: 'education', label: '教育' },
        { value: 'entertainment', label: 'エンターテイメント' },
        { value: 'travel', label: '旅行' },
        { value: 'food', label: '料理・グルメ' },
        { value: 'sports', label: 'スポーツ' },
        { value: 'arts', label: 'アート・文化' },
        { value: 'finance', label: '金融・投資' }
      ] as InterestOption[]
    }
  },

  mounted() {
    this.loadSelectedStore()
    this.trackPageLoad()
  },

  methods: {
    loadSelectedStore(): void {
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

    handleSubmit(): void {
      console.log('Registration form submitted:', this.form)
      
      if (window.clarity) {
        window.clarity('event', 'registration_submitted', {
          hasNewsletter: this.form.subscribeNewsletter,
          occupation: this.form.occupation,
          interestCount: this.form.interests.length,
          howDidYouHear: this.form.howDidYouHear
        })
      }
      
      localStorage.setItem('registrationData', JSON.stringify(this.form))
      
      this.$router.push('/confirmation')
    },

    trackInterestChange(): void {
      if (window.clarity) {
        window.clarity('event', 'interests_changed', {
          selectedInterests: this.form.interests,
          count: this.form.interests.length
        })
      }
    },

    trackHowDidYouHear(): void {
      if (window.clarity) {
        window.clarity('event', 'how_did_you_hear_selected', {
          source: this.form.howDidYouHear
        })
      }
    },

    trackTermsAgreement(): void {
      if (window.clarity) {
        window.clarity('event', 'terms_agreement_changed', {
          agreed: this.form.agreeToTerms
        })
      }
    },

    trackNewsletterSubscription(): void {
      if (window.clarity) {
        window.clarity('event', 'newsletter_subscription_changed', {
          subscribed: this.form.subscribeNewsletter
        })
      }
    },

    trackPageLoad(): void {
      if (window.clarity) {
        window.clarity('event', 'member_registration_page_loaded')
      }
      console.log('Member registration page loaded')
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>👤 会員登録</h1>
      <p>会員情報を入力してください</p>
    </div>

    <div class="breadcrumb">
      <nuxt-link to="/">トップ</nuxt-link> > 
      <nuxt-link to="/store-selection">店舗選択</nuxt-link> > 会員登録
    </div>

    <div v-if="selectedStoreName" class="selected-store">
      <strong>選択された店舗:</strong> {{ selectedStoreName }}
    </div>

    <form @submit.prevent="handleSubmit" class="form-section">
      <h3>基本情報</h3>
      
      <div class="form-row">
        <div class="form-group">
          <label for="lastName">姓 <span class="required">*</span></label>
          <input v-model="form.lastName" type="text" id="lastName" required>
        </div>
        <div class="form-group">
          <label for="firstName">名 <span class="required">*</span></label>
          <input v-model="form.firstName" type="text" id="firstName" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="lastNameKana">姓（カナ） <span class="required">*</span></label>
          <input v-model="form.lastNameKana" type="text" id="lastNameKana" required>
        </div>
        <div class="form-group">
          <label for="firstNameKana">名（カナ） <span class="required">*</span></label>
          <input v-model="form.firstNameKana" type="text" id="firstNameKana" required>
        </div>
      </div>

      <div class="form-group">
        <label for="email">メールアドレス <span class="required">*</span></label>
        <input v-model="form.email" type="email" id="email" required>
      </div>

      <div class="form-group">
        <label for="phone">電話番号 <span class="required">*</span></label>
        <input v-model="form.phone" type="tel" id="phone" required>
      </div>

      <div class="form-group">
        <label for="birthdate">生年月日</label>
        <input v-model="form.birthdate" type="date" id="birthdate">
      </div>

      <div class="form-group">
        <label for="gender">性別</label>
        <select v-model="form.gender" id="gender">
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
          <option value="prefer-not-to-say">回答しない</option>
        </select>
      </div>

      <h3>住所情報</h3>
      
      <div class="form-group">
        <label for="postalCode">郵便番号</label>
        <input v-model="form.postalCode" type="text" id="postalCode" placeholder="123-4567">
      </div>

      <div class="form-group">
        <label for="prefecture">都道府県</label>
        <select v-model="form.prefecture" id="prefecture">
          <option value="">選択してください</option>
          <option v-for="pref in prefectures" :key="pref" :value="pref">{{ pref }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="city">市区町村</label>
        <input v-model="form.city" type="text" id="city">
      </div>

      <div class="form-group">
        <label for="address">番地・建物名</label>
        <input v-model="form.address" type="text" id="address">
      </div>

      <h3>その他</h3>
      
      <div class="form-group">
        <label for="occupation">職業</label>
        <select v-model="form.occupation" id="occupation">
          <option value="">選択してください</option>
          <option value="student">学生</option>
          <option value="office-worker">会社員</option>
          <option value="public-servant">公務員</option>
          <option value="self-employed">自営業</option>
          <option value="freelance">フリーランス</option>
          <option value="homemaker">主婦・主夫</option>
          <option value="retired">無職・退職</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div class="form-group">
        <label for="interests">興味のある分野（複数選択可）</label>
        <div class="checkbox-group">
          <label v-for="interest in interestOptions" :key="interest.value" class="checkbox-label">
            <input 
              type="checkbox" 
              :value="interest.value" 
              v-model="form.interests"
              @change="trackInterestChange"
            >
            {{ interest.label }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="howDidYouHear">当サービスをどちらで知りましたか？</label>
        <select v-model="form.howDidYouHear" id="howDidYouHear" @change="trackHowDidYouHear">
          <option value="">選択してください</option>
          <option value="web-search">ウェブ検索</option>
          <option value="social-media">SNS</option>
          <option value="friend-referral">友人の紹介</option>
          <option value="advertisement">広告</option>
          <option value="news-media">ニュース・メディア</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div class="form-group">
        <label for="specialRequests">特別なご要望・アレルギー等</label>
        <textarea v-model="form.specialRequests" id="specialRequests" rows="4" placeholder="ご要望やアレルギー情報があればご記入ください"></textarea>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="form.agreeToTerms" 
            required
            @change="trackTermsAgreement"
          >
          <span class="required">*</span> 利用規約とプライバシーポリシーに同意する
        </label>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="form.subscribeNewsletter"
            @change="trackNewsletterSubscription"
          >
          メールマガジンを受け取る
        </label>
      </div>

      <div class="button-group">
        <nuxt-link to="/store-selection" class="btn btn-secondary">戻る</nuxt-link>
        <button type="submit" class="btn btn-primary" :disabled="!form.agreeToTerms">登録して次へ</button>
      </div>
    </form>
  </div>
</template>

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
.form-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  margin: 30px 0;
}
.form-group {
  margin-bottom: 25px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}
.required {
  color: #e74c3c;
}
input, select, textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3498db;
}
.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
  margin-bottom: 0;
}
.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
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
.btn-secondary {
  background: #95a5a6;
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