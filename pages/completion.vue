<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: '登録完了 - 予約システム',
      script: [
        {
          innerHTML: "window.clarity('set', 'pageID', 'completion');"
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'clarity-page': ['innerHTML']
      }
    }
  },

  data() {
    return {
      customerName: '',
      selectedStoreName: '',
      hasNewsletter: false,
      surveyRating: 0,
      surveyFeedback: '',
      surveySubmitted: false
    }
  },

  mounted() {
    this.loadCompletionData()
    this.trackPageLoad()
  },

  methods: {
    loadCompletionData(): void {
      const registrationData = localStorage.getItem('registrationData')
      if (registrationData) {
        const form = JSON.parse(registrationData)
        this.customerName = `${form.lastName} ${form.firstName}`
        this.hasNewsletter = form.subscribeNewsletter
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

    setSurveyRating(rating: number): void {
      this.surveyRating = rating
      
      if (window.clarity) {
        window.clarity('event', 'completion_survey_rating', {
          rating: rating
        })
      }
    },

    submitSurvey(): void {
      if (this.surveySubmitted) return
      
      console.log('Survey submitted:', {
        rating: this.surveyRating,
        feedback: this.surveyFeedback
      })
      
      if (window.clarity) {
        window.clarity('event', 'completion_survey_submitted', {
          rating: this.surveyRating,
          hasFeedback: this.surveyFeedback.length > 0
        })
      }
      
      this.surveySubmitted = true
      alert('アンケートにご協力いただき、ありがとうございました！')
    },

    downloadReceipt(): void {
      if (window.clarity) {
        window.clarity('event', 'registration_receipt_download')
      }
      
      const receiptContent = `
登録証明書
-----------------
お名前: ${this.customerName}
登録店舗: ${this.selectedStoreName}
登録日時: ${new Date().toLocaleString('ja-JP')}
登録ID: REG-${Date.now()}

この度は会員登録いただき、ありがとうございました。
      `
      
      const blob = new Blob([receiptContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '登録証明書.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },

    trackPageLoad(): void {
      if (window.clarity) {
        window.clarity('event', 'completion_page_loaded', {
          hasNewsletter: this.hasNewsletter,
          selectedStore: localStorage.getItem('selectedStore')
        })
      }
      console.log('Completion page loaded')
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="header success">
      <h1>🎉 登録完了</h1>
      <p>会員登録が正常に完了しました</p>
    </div>

    <div class="completion-content">
      <div class="success-icon">
        <div class="checkmark">✓</div>
      </div>
      
      <div class="message-section">
        <h2>ありがとうございます！</h2>
        <p>{{ customerName }}様の会員登録が完了いたしました。</p>
        <p v-if="selectedStoreName">
          <strong>{{ selectedStoreName }}</strong> でのご利用をお待ちしております。
        </p>
      </div>

      <div class="next-steps">
        <h3>今後の流れ</h3>
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>確認メール送信</h4>
              <p>ご登録いただいたメールアドレスに確認メールをお送りします。</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>サービス利用開始</h4>
              <p>メール内のリンクをクリックして、サービスをご利用いただけます。</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>初回特典のご利用</h4>
              <p>新規会員様限定の特典をご利用いただけます。</p>
            </div>
          </div>
        </div>
      </div>

      <div class="additional-info">
        <h3>お得な情報</h3>
        <div class="info-cards">
          <div class="info-card">
            <h4>🎁 新規会員特典</h4>
            <p>初回利用時に20%オフクーポンをプレゼント！</p>
          </div>
          <div class="info-card">
            <h4>📱 公式アプリ</h4>
            <p>アプリをダウンロードして、より便利にご利用ください。</p>
          </div>
          <div class="info-card">
            <h4>🔔 お知らせ</h4>
            <p v-if="hasNewsletter">
              メールマガジンにご登録いただき、ありがとうございます。最新情報をお届けします。
            </p>
            <p v-else>
              メールマガジンでお得な情報をお届けしております。ぜひご登録ください。
            </p>
          </div>
        </div>
      </div>

      <div class="survey-section">
        <h3>簡単アンケート</h3>
        <p>サービス向上のため、簡単なアンケートにご協力ください（任意）</p>
        <div class="survey-question">
          <label>今回の登録プロセスはいかがでしたか？</label>
          <div class="rating-buttons">
            <button 
              v-for="rating in [1, 2, 3, 4, 5]" 
              :key="rating"
              class="rating-btn"
              :class="{ active: surveyRating === rating }"
              @click="setSurveyRating(rating)"
            >
              {{ rating }}
            </button>
          </div>
        </div>
        <div v-if="surveyRating" class="survey-feedback">
          <label>ご意見・ご感想（任意）</label>
          <textarea 
            v-model="surveyFeedback" 
            placeholder="改善点やご感想があればお聞かせください"
            rows="3"
          ></textarea>
          <button @click="submitSurvey" class="btn btn-secondary">送信</button>
        </div>
      </div>
    </div>

    <div class="button-group">
      <nuxt-link to="/" class="btn btn-primary">トップページに戻る</nuxt-link>
      <button @click="downloadReceipt" class="btn btn-secondary">登録証明書をダウンロード</button>
    </div>
  </div>
</template>

<style scoped>
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: '登録完了 - 予約システム',
      script: [
        {
          innerHTML: "window.clarity('set', 'pageID', 'completion');"
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'clarity-page': ['innerHTML']
      }
    }
  },

  data() {
    return {
      customerName: '',
      selectedStoreName: '',
      hasNewsletter: false,
      surveyRating: 0,
      surveyFeedback: '',
      surveySubmitted: false
    }
  },

  mounted() {
    this.loadCompletionData()
    this.trackPageLoad()
  },

  methods: {
    loadCompletionData(): void {
      // 登録データを読み込み
      const registrationData = localStorage.getItem('registrationData')
      if (registrationData) {
        const form = JSON.parse(registrationData)
        this.customerName = `${form.lastName} ${form.firstName}`
        this.hasNewsletter = form.subscribeNewsletter
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

    setSurveyRating(rating: number): void {
      this.surveyRating = rating
      
      if ((window as any).clarity) {
        (window as any).clarity('event', 'completion_survey_rating', {
          rating: rating
        })
      }
    },

    submitSurvey(): void {
      if (this.surveySubmitted) return
      
      console.log('Survey submitted:', {
        rating: this.surveyRating,
        feedback: this.surveyFeedback
      })
      
      if ((window as any).clarity) {
        (window as any).clarity('event', 'completion_survey_submitted', {
          rating: this.surveyRating,
          hasFeedback: this.surveyFeedback.length > 0
        })
      }
      
      this.surveySubmitted = true
      alert('アンケートにご協力いただき、ありがとうございました！')
    },

    downloadReceipt(): void {
      if ((window as any).clarity) {
        (window as any).clarity('event', 'registration_receipt_download')
      }
      
      // 簡単な登録証明書のテキストを生成
      const receiptContent = `
登録証明書
-----------------
お名前: ${this.customerName}
登録店舗: ${this.selectedStoreName}
登録日時: ${new Date().toLocaleString('ja-JP')}
登録ID: REG-${Date.now()}

この度は会員登録いただき、ありがとうございました。
      `
      
      const blob = new Blob([receiptContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '登録証明書.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },

    trackPageLoad(): void {
      if ((window as any).clarity) {
        (window as any).clarity('event', 'completion_page_loaded', {
          hasNewsletter: this.hasNewsletter,
          selectedStore: localStorage.getItem('selectedStore')
        })
      }
      console.log('Completion page loaded')
    }
  }
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.header.success {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  border-radius: 10px;
  color: white;
}
.completion-content {
  padding: 0 20px;
}
.success-icon {
  text-align: center;
  margin: 30px 0;
}
.checkmark {
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #2ecc71;
  border-radius: 50%;
  color: white;
  font-size: 40px;
  line-height: 80px;
  font-weight: bold;
  animation: checkmark-bounce 0.6s ease-in-out;
}
@keyframes checkmark-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.message-section {
  text-align: center;
  margin: 40px 0;
}
.message-section h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}
.message-section p {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
}
.next-steps {
  margin: 50px 0;
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}
.step-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}
.step-number {
  width: 40px;
  height: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}
.step-content h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}
.step-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}
.additional-info {
  margin: 50px 0;
}
.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
}
.info-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
  border-left: 4px solid #3498db;
}
.info-card h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}
.info-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}
.survey-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  margin: 50px 0;
}
.survey-question {
  margin-top: 20px;
}
.survey-question label {
  display: block;
  font-weight: bold;
  color: #555;
  margin-bottom: 15px;
}
.rating-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.rating-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}
.rating-btn:hover {
  border-color: #3498db;
  background: #f0f8ff;
}
.rating-btn.active {
  border-color: #3498db;
  background: #3498db;
  color: white;
}
.survey-feedback {
  margin-top: 20px;
}
.survey-feedback label {
  display: block;
  font-weight: bold;
  color: #555;
  margin-bottom: 10px;
}
.survey-feedback textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
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
  margin-top: 15px;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 50px;
  flex-wrap: wrap;
}
h3 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 25px;
}
</style>