import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE, STORAGE_KEYS } from './constants'

// Translation resources
const resources = {
  vi: {
    translation: {
      // Common
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
      success: 'Thành công',
      cancel: 'Hủy',
      save: 'Lưu',
      edit: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      
      // Navigation
      home: 'Trang chủ',
      properties: 'Bất động sản',
      contact: 'Liên hệ',
      about: 'Giới thiệu',
      
      // Property
      apartment: 'Căn hộ',
      room: 'Phòng trọ',
      price: 'Giá',
      address: 'Địa chỉ',
      amenities: 'Tiện ích',
      available: 'Còn trống',
      featured: 'Nổi bật',
      
      // Contact
      name: 'Họ tên',
      email: 'Email',
      phone: 'Số điện thoại',
      subject: 'Tiêu đề',
      message: 'Tin nhắn',
      sendMessage: 'Gửi tin nhắn',
      
      // Validation
      required: 'Trường này là bắt buộc',
      invalidEmail: 'Email không hợp lệ',
      invalidPhone: 'Số điện thoại không hợp lệ'
    }
  },
  en: {
    translation: {
      // Common
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      
      // Navigation
      home: 'Home',
      properties: 'Properties',
      contact: 'Contact',
      about: 'About',
      
      // Property
      apartment: 'Apartment',
      room: 'Room',
      price: 'Price',
      address: 'Address',
      amenities: 'Amenities',
      available: 'Available',
      featured: 'Featured',
      
      // Contact
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Message',
      sendMessage: 'Send Message',
      
      // Validation
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidPhone: 'Invalid phone number'
    }
  },
  ja: {
    translation: {
      // Common
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      success: '成功',
      cancel: 'キャンセル',
      save: '保存',
      edit: '編集',
      delete: '削除',
      create: '作成',
      search: '検索',
      filter: 'フィルター',
      
      // Navigation
      home: 'ホーム',
      properties: '物件',
      contact: 'お問い合わせ',
      about: '会社概要',
      
      // Property
      apartment: 'アパート',
      room: '部屋',
      price: '価格',
      address: '住所',
      amenities: '設備',
      available: '空室',
      featured: 'おすすめ',
      
      // Contact
      name: '氏名',
      email: 'メールアドレス',
      phone: '電話番号',
      subject: '件名',
      message: 'メッセージ',
      sendMessage: 'メッセージを送信',
      
      // Validation
      required: 'この項目は必須です',
      invalidEmail: '無効なメールアドレス',
      invalidPhone: '無効な電話番号'
    }
  }
}

// Get saved locale or use default
const savedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE) || DEFAULT_LOCALE

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLocale,
    fallbackLng: DEFAULT_LOCALE,
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    react: {
      useSuspense: false
    }
  })

// Save locale changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEYS.LOCALE, lng)
})

export default i18n