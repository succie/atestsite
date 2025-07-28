<script lang="ts">
import Vue from 'vue'

interface FormData {
  name: string
  email: string
  category: string
  message: string
  newsletter: boolean
}

export default Vue.extend({
  head() {
    return {
      script: [
        {
          innerHTML: "window.clarity('set', 'pageID', 'index');"
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'clarity-page': ['innerHTML']
      }
    }
  },

  data() {
    return {
      form: {
        name: '',
        email: '',
        category: '',
        message: '',
        newsletter: false
      } as FormData,
      priceSlider: 50000,
      satisfactionSlider: 5,
      modalVisible: false,
      fakeErrorVisible: false,
      fakeButtonClicks: 0,
      doubleClickCount: 0,
      doubleClickText: 'ダブルクリックが必要',
      longPressTimer: null as number | null,
      longPressProgress: 0
    }
  },

  computed: {
    priceValue(): number {
      return this.priceSlider
    }
  },

  mounted() {
    this.setupScrollTracking()
    this.trackPageLoad()
  },

  methods: {

    trackClick(element: string): void {
      console.log('Clicked:', element)
      if (window.clarity) {
        window.clarity('event', 'click', { element })
      }
      alert(`${element} がクリックされました！`)
    },

    trackCardClick(cardId: string): void {
      console.log('Card clicked:', cardId)
      if (window.clarity) {
        window.clarity('event', 'card_click', { card: cardId })
      }
    },

    trackImageClick(imageId: string): void {
      console.log('Image clicked:', imageId)
      if (window.clarity) {
        window.clarity('event', 'image_click', { image: imageId })
      }
    },

    trackSelection(value: string): void {
      console.log('Selection changed:', value)
      if (window.clarity) {
        window.clarity('event', 'selection_change', { value })
      }
    },

    trackCheckbox(checked: boolean): void {
      console.log('Checkbox changed:', checked)
      if (window.clarity) {
        window.clarity('event', 'checkbox_change', { checked })
      }
    },

    trackSlider(value: number): void {
      console.log('Slider changed:', value)
      if (window.clarity) {
        window.clarity('event', 'slider_change', { value })
      }
    },

    updatePrice(): void {
      // リアクティブに更新される
    },

    handleSubmit(): void {
      console.log('Form submitted:', this.form)
      
      if (window.clarity) {
        window.clarity('event', 'form_submit', { 
          category: this.form.category,
          newsletter: this.form.newsletter ? 'yes' : 'no'
        })
      }
      
      alert('フォームが送信されました！\n' + JSON.stringify(this.form, null, 2))
    },

    openModal(): void {
      this.modalVisible = true
      if (window.clarity) {
        window.clarity('event', 'modal_open')
      }
    },

    closeModal(): void {
      this.modalVisible = false
      if (window.clarity) {
        window.clarity('event', 'modal_close')
      }
    },

    showSection(sectionName: string): void {
      console.log('Navigation:', sectionName)
      if (window.clarity) {
        window.clarity('event', 'navigation', { section: sectionName })
      }
    },

    startReservation(): void {
      console.log('Reservation flow started')
      if (window.clarity) {
        window.clarity('event', 'reservation_start')
      }
    },

    handleFakeButtonClick(): void {
      this.fakeButtonClicks++
      
      if (this.fakeButtonClicks < 3) {
        this.trackFrustration('fake-button-click', { clicks: this.fakeButtonClicks })
      } else {
        this.trackFrustration('fake-button-disabled', { totalClicks: this.fakeButtonClicks })
      }
    },

    handleLoadingButton(): void {
      const btn = this.$refs.loadingBtn as HTMLButtonElement
      btn.classList.add('loading')
      btn.disabled = true
      btn.textContent = 'ローディング中...'
      
      this.trackFrustration('loading-button-click', {})
      
      setTimeout(() => {
        btn.classList.remove('loading')
        btn.disabled = false
        btn.textContent = '永遠にローディング'
      }, 10000)
    },

    moveButton(event: Event): void {
      const element = event.target as HTMLElement
      const randomX = Math.random() * 100 - 50
      const randomY = Math.random() * 50 - 25
      element.style.transform = `translate(${randomX}px, ${randomY}px)`
      this.trackFrustration('button-moved', { x: randomX, y: randomY })
    },

    handleBrokenLink(): void {
      this.trackFrustration('broken-link-click', {})
    },

    showFakeError(): void {
      this.fakeErrorVisible = true
      this.trackFrustration('fake-error-triggered', {})
    },

    handleDoubleClickButton(): void {
      this.doubleClickCount++
      
      if (this.doubleClickCount === 1) {
        this.doubleClickText = 'もう一度クリック！'
        this.trackFrustration('double-click-first', {})
        setTimeout(() => {
          if (this.doubleClickCount === 1) {
            this.doubleClickText = 'ダブルクリックが必要'
            this.doubleClickCount = 0
          }
        }, 3000)
      } else if (this.doubleClickCount >= 2) {
        this.doubleClickText = '成功！'
        this.trackClick('double-click-success')
        setTimeout(() => {
          this.doubleClickText = 'ダブルクリックが必要'
          this.doubleClickCount = 0
        }, 2000)
      }
    },

    startLongPress(): void {
      let progress = 0
      
      this.longPressTimer = window.setInterval(() => {
        progress += 100/30
        this.longPressProgress = Math.min(progress, 100)
        
        if (progress >= 100) {
          this.endLongPress()
          this.trackClick('long-press-success')
        }
      }, 100)
      
      this.trackFrustration('long-press-start', {})
    },

    endLongPress(): void {
      if (this.longPressTimer) {
        clearInterval(this.longPressTimer)
        this.longPressTimer = null
        this.longPressProgress = 0
        this.trackFrustration('long-press-cancelled', {})
      }
    },

    trackFrustration(action: string, data: Record<string, unknown>): void {
      console.log('Frustration event:', action, data)
      if (window.clarity) {
        window.clarity('event', 'frustration', { 
          action, 
          ...data,
          timestamp: Date.now()
        })
      }
    },

    setupScrollTracking(): void {
      let scrollTimeout: number
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout)
        scrollTimeout = window.setTimeout(() => {
          const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
          console.log('Scroll depth:', scrollPercent + '%')
          
          if (window.clarity) {
            window.clarity('event', 'scroll_depth', { percent: scrollPercent })
          }
        }, 250)
      })
    },

    trackPageLoad(): void {
      if (window.clarity) {
        window.clarity('event', 'page_loaded')
      }
      console.log('Page fully loaded')
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Microsoft Clarity テストサイト</h1>
      <p>ヒートマップとユーザーレコーディングのテスト用サイトです</p>
      <small style="opacity: 0.8; font-size: 12px;">Built with Nuxt</small>
    </div>

    <nav class="navigation-menu">
      <a href="#home" class="nav-link" @click="showSection('home')">ホーム</a>
      <a href="#features" class="nav-link" @click="showSection('features')">機能</a>
      <a href="#contact" class="nav-link" @click="showSection('contact')">お問い合わせ</a>
      <a href="#gallery" class="nav-link" @click="showSection('gallery')">ギャラリー</a>
    </nav>

    <div class="button-group">
      <button class="btn btn-primary" @click="trackClick('primary-button')">プライマリボタン</button>
      <button class="btn btn-success" @click="trackClick('success-button')">成功ボタン</button>
      <button class="btn btn-warning" @click="trackClick('warning-button')">警告ボタン</button>
      <button class="btn btn-danger" @click="trackClick('danger-button')">危険ボタン</button>
      <button class="btn btn-primary" @click="openModal()">モーダルを開く</button>
      <nuxt-link to="/store-selection" class="btn btn-success" @click="startReservation()">🏪 予約</nuxt-link>
    </div>

    <div class="form-section">
      <h2>お問い合わせフォーム</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">お名前</label>
          <input v-model="form.name" type="text" id="name" name="name" placeholder="お名前を入力してください" required>
        </div>
        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input v-model="form.email" type="email" id="email" name="email" placeholder="メールアドレスを入力してください" required>
        </div>
        <div class="form-group">
          <label for="category">カテゴリ</label>
          <select v-model="form.category" id="category" name="category" @change="trackSelection(form.category)">
            <option value="">選択してください</option>
            <option value="inquiry">お問い合わせ</option>
            <option value="support">サポート</option>
            <option value="feedback">フィードバック</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">メッセージ</label>
          <textarea v-model="form.message" id="message" name="message" rows="5" placeholder="メッセージを入力してください" required></textarea>
        </div>
        <div class="form-group">
          <input v-model="form.newsletter" type="checkbox" id="newsletter" name="newsletter" @change="trackCheckbox(form.newsletter)">
          <label for="newsletter">ニュースレターを受け取る</label>
        </div>
        <button type="submit" class="btn btn-primary">送信</button>
      </form>
    </div>

    <div class="interactive-section">
      <div class="card" @click="trackCardClick('card1')">
        <h3>カード1</h3>
        <p>これはクリック可能なカードです。ユーザーの行動を追跡します。</p>
        <button class="btn btn-success" @click.stop="trackClick('card1-button')">詳細を見る</button>
      </div>
      <div class="card" @click="trackCardClick('card2')">
        <h3>カード2</h3>
        <p>別のクリック可能なカードです。ヒートマップデータを生成します。</p>
        <button class="btn btn-warning" @click.stop="trackClick('card2-button')">もっと見る</button>
      </div>
      <div class="card" @click="trackCardClick('card3')">
        <h3>カード3</h3>
        <p>3番目のカードです。異なるユーザー行動パターンをテストします。</p>
        <button class="btn btn-danger" @click.stop="trackClick('card3-button')">アクション</button>
      </div>
    </div>

    <div class="slider-container">
      <h3>インタラクティブスライダー</h3>
      <p>価格範囲: <span>{{ priceValue.toLocaleString() }}</span>円</p>
      <input v-model="priceSlider" type="range" class="slider" min="10000" max="100000" @input="updatePrice" @change="trackSlider(priceSlider)">
      
      <p>満足度: <span>{{ satisfactionSlider }}</span>/10</p>
      <input v-model="satisfactionSlider" type="range" class="slider" min="1" max="10" @change="trackSlider(satisfactionSlider)">
    </div>

    <div class="image-gallery">
      <div v-for="i in 6" :key="i" class="image-placeholder" @click="trackImageClick(`image${i}`)">画像 {{ i }}</div>
    </div>

    <!-- ダメなUXセクション -->
    <div class="bad-ux-section">
      <div class="bad-ux-title">🚨 フラストレーション体験エリア 🚨</div>
      <p>以下の要素はわざと使いにくく作られています。ユーザーのフラストレーションを測定するためのテストです。</p>
      
      <div class="button-group">
        <div class="fake-button" @click="handleFakeButtonClick">
          押せそうで押せない
        </div>
        
        <button ref="loadingBtn" class="btn btn-primary loading-button" @click="handleLoadingButton">
          永遠にローディング
        </button>
        
        <button class="btn btn-warning moving-target" @mouseenter="moveButton" @click="trackClick('moving-button')">
          逃げるボタン
        </button>
        
        <button class="btn btn-success fake-disabled" @click="trackClick('fake-disabled-button')">
          無効に見えるボタン
        </button>
      </div>
      
      <div style="position: relative; margin: 20px 0;">
        <p>この文章の中に<span class="broken-link" @click="handleBrokenLink">リンクのように見える文字</span>がありますが、クリックしても何も起きません。また、この文章の下には見えないボタンがあります。</p>
        <button class="invisible-clickable" style="top: 10px; left: 200px;" @click="trackClick('invisible-button')" title="隠されたボタン"></button>
      </div>
      
      <div style="margin: 20px 0;">
        <label>重要な情報（必須）</label>
        <input type="text" placeholder="ここをクリックしてください..." @click="showFakeError" readonly style="cursor: pointer;">
        <small v-show="fakeErrorVisible" style="color: #dc3545;" id="fakeError">エラー: この入力フィールドは現在利用できません</small>
      </div>
      
      <button class="btn btn-danger" @click="handleDoubleClickButton" :data-clicks="doubleClickCount">
        {{ doubleClickText }}
      </button>
      
      <button class="btn btn-info" @mousedown="startLongPress" @mouseup="endLongPress" @mouseleave="endLongPress">
        長押しボタン (3秒)
        <div id="longPressProgress" :style="{ width: longPressProgress + '%' }"></div>
      </button>
    </div>

    <div class="content-area">
      <h2>長いコンテンツエリア</h2>
      <p>このエリアはスクロール行動を測定するための長いコンテンツです。ユーザーがどこまでスクロールするかを確認できます。</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
      <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
      <div class="button-group">
        <button class="btn btn-primary" @click="trackClick('content-cta1')">今すぐ始める</button>
        <button class="btn btn-success" @click="trackClick('content-cta2')">詳細を見る</button>
        <a href="#top" class="btn btn-warning" @click="trackClick('scroll-to-top')">トップに戻る</a>
      </div>
    </div>

    <!-- モーダル -->
    <div v-show="modalVisible" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>モーダルウィンドウ</h2>
        <p>これはモーダルウィンドウです。ユーザーのインタラクションを追跡します。</p>
        <div class="button-group">
          <button class="btn btn-primary" @click="closeModal(); trackClick('modal-confirm')">確認</button>
          <button class="btn btn-danger" @click="closeModal(); trackClick('modal-cancel')">キャンセル</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 既存のスタイルをそのまま移植 */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}
.container {
  max-width: 1200px;
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
.button-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 30px 0;
}
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}
.btn-primary { background: #3498db; color: white; }
.btn-success { background: #2ecc71; color: white; }
.btn-warning { background: #f39c12; color: white; }
.btn-danger { background: #e74c3c; color: white; }
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
.form-section {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
  margin: 30px 0;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}
input, select, textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3498db;
}
.interactive-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 30px 0;
}
.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border: 1px solid #eee;
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-5px);
}
.navigation-menu {
  background: #2c3e50;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 30px;
}
.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.nav-link:hover {
  background-color: #34495e;
}
.content-area {
  min-height: 400px;
  padding: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  margin: 20px 0;
}
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
}
.image-placeholder {
  height: 150px;
  background: linear-gradient(45deg, #74b9ff, #0984e3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.image-placeholder:hover {
  transform: scale(1.05);
}
.slider-container {
  margin: 30px 0;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
}
.slider {
  width: 100%;
  margin: 20px 0;
}
.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}
.modal-content {
  background-color: white;
  margin: 15% auto;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}
.close:hover {
  color: black;
}

/* ダメなUXスタイル */
.fake-button {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  background: #3498db;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.fake-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.fake-button.disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  pointer-events: none;
}

.invisible-clickable {
  position: absolute;
  background: transparent;
  border: none;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 10;
}

.loading-button {
  position: relative;
  overflow: hidden;
}

.loading-button.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: loading-sweep 2s infinite;
}

@keyframes loading-sweep {
  0% { left: -100%; }
  100% { left: 100%; }
}

.shake-element {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.broken-link {
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
}

.broken-link:hover {
  color: #2980b9;
}

.fake-disabled {
  opacity: 0.6;
  filter: grayscale(50%);
}

.moving-target {
  transition: all 0.3s ease;
}

.moving-target:hover {
  transform: translate(20px, 10px);
}

.bad-ux-section {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 10px;
  padding: 20px;
  margin: 30px 0;
}

.bad-ux-title {
  color: #856404;
  font-weight: bold;
  margin-bottom: 15px;
}

#longPressProgress {
  height: 3px;
  background: #fff;
  margin-top: 5px;
  transition: width 0.1s;
}
</style>