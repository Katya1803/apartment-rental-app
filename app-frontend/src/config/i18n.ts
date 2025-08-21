import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE, STORAGE_KEYS } from './constants'

// Translation resources for public pages (3 languages)
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
      clear: 'Xóa',
      submit: 'Gửi',
      back: 'Quay lại',
      next: 'Tiếp theo',
      previous: 'Trước đó',
      viewDetails: 'Xem chi tiết',
      
      // Navigation
      home: 'Trang chủ',
      properties: 'Bất động sản',
      apartments: 'Căn hộ',
      rooms: 'Phòng trọ',
      favourites: 'Yêu thích',
      contact: 'Liên hệ',
      guide: 'Hướng dẫn',
      about: 'Giới thiệu',
      
      // Property
      apartment: 'Căn hộ',
      room: 'Phòng trọ',
      studio: 'Studio',
      house: 'Nhà nguyên căn',
      price: 'Giá',
      priceRange: 'Khoảng giá',
      area: 'Diện tích',
      address: 'Địa chỉ',
      amenities: 'Tiện ích',
      bedrooms: 'Phòng ngủ',
      bathrooms: 'Phòng tắm',
      floor: 'Tầng',
      available: 'Còn trống',
      featured: 'Nổi bật',
      viewDescription: 'Mô tả view',
      petPolicy: 'Chính sách thú cưng',
      
      // Search & Filter
      searchProperties: 'Tìm kiếm bất động sản',
      searchPlaceholder: 'Nhập từ khóa tìm kiếm...',
      propertyType: 'Loại bất động sản',
      allTypes: 'Tất cả loại',
      minPrice: 'Giá tối thiểu',
      maxPrice: 'Giá tối đa',
      minArea: 'Diện tích tối thiểu',
      maxArea: 'Diện tích tối đa',
      minBedrooms: 'Số phòng ngủ tối thiểu',
      maxBedrooms: 'Số phòng ngủ tối đa',
      featuredOnly: 'Chỉ bất động sản nổi bật',
      applyFilter: 'Áp dụng bộ lọc',
      clearFilter: 'Xóa bộ lọc',
      
      // Contact
      contactUs: 'Liên hệ với chúng tôi',
      fullName: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      subject: 'Tiêu đề',
      message: 'Tin nhắn',
      sendMessage: 'Gửi tin nhắn',
      contactInfo: 'Thông tin liên hệ',
      
      // Favourites
      addToFavourites: 'Thêm vào yêu thích',
      removeFromFavourites: 'Bỏ khỏi yêu thích',
      noFavourites: 'Bạn chưa có bất động sản yêu thích nào',
      favouriteAdded: 'Đã thêm vào danh sách yêu thích',
      favouriteRemoved: 'Đã bỏ khỏi danh sách yêu thích',
      
      // Property listing
      noPropertiesFound: 'Không tìm thấy bất động sản nào',
      showingResults: 'Hiển thị {{from}} - {{to}} trong tổng số {{total}} kết quả',
      loadMore: 'Tải thêm',
      
      // Currency & Units
      vnd: 'VNĐ',
      sqm: 'm²',
      perMonth: '/tháng',
      million: 'triệu',
      billion: 'tỷ',
      
      // Validation
      required: 'Trường này là bắt buộc',
      invalidEmail: 'Email không hợp lệ',
      invalidPhone: 'Số điện thoại không hợp lệ',
      minLength: 'Tối thiểu {{min}} ký tự',
      maxLength: 'Tối đa {{max}} ký tự',
      
      // Company info
      companyName: 'Tên công ty',
      companyAddress: 'Địa chỉ công ty',
      companyPhone: 'Điện thoại công ty',
      companyEmail: 'Email công ty',
      zaloContact: 'Liên hệ Zalo',
      
      // Footer
      allRightsReserved: 'Tất cả quyền được bảo lưu',
      
      // Messages
      messageSuccess: 'Tin nhắn đã được gửi thành công!',
      messageError: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.',
      loadingProperties: 'Đang tải danh sách bất động sản...',
      loadingPropertyDetails: 'Đang tải thông tin chi tiết...'
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
      clear: 'Clear',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      viewDetails: 'View Details',
      
      // Navigation
      home: 'Home',
      properties: 'Properties',
      apartments: 'Apartments',
      rooms: 'Rooms',
      favourites: 'Favourites',
      contact: 'Contact',
      guide: 'Guide',
      about: 'About',
      
      // Property
      apartment: 'Apartment',
      room: 'Room',
      studio: 'Studio',
      house: 'House',
      price: 'Price',
      priceRange: 'Price Range',
      area: 'Area',
      address: 'Address',
      amenities: 'Amenities',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      floor: 'Floor',
      available: 'Available',
      featured: 'Featured',
      viewDescription: 'View Description',
      petPolicy: 'Pet Policy',
      
      // Search & Filter
      searchProperties: 'Search Properties',
      searchPlaceholder: 'Enter search keywords...',
      propertyType: 'Property Type',
      allTypes: 'All Types',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      minArea: 'Min Area',
      maxArea: 'Max Area',
      minBedrooms: 'Min Bedrooms',
      maxBedrooms: 'Max Bedrooms',
      featuredOnly: 'Featured Only',
      applyFilter: 'Apply Filter',
      clearFilter: 'Clear Filter',
      
      // Contact
      contactUs: 'Contact Us',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Message',
      sendMessage: 'Send Message',
      contactInfo: 'Contact Information',
      
      // Favourites
      addToFavourites: 'Add to Favourites',
      removeFromFavourites: 'Remove from Favourites',
      noFavourites: 'You have no favourite properties yet',
      favouriteAdded: 'Added to favourites',
      favouriteRemoved: 'Removed from favourites',
      
      // Property listing
      noPropertiesFound: 'No properties found',
      showingResults: 'Showing {{from}} - {{to}} of {{total}} results',
      loadMore: 'Load More',
      
      // Currency & Units
      vnd: 'VND',
      sqm: 'm²',
      perMonth: '/month',
      million: 'million',
      billion: 'billion',
      
      
      // Validation
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidPhone: 'Invalid phone number',
      minLength: 'Minimum {{min}} characters',
      maxLength: 'Maximum {{max}} characters',
      
      // Company info
      companyName: 'Company Name',
      companyAddress: 'Company Address',
      companyPhone: 'Company Phone',
      companyEmail: 'Company Email',
      zaloContact: 'Zalo Contact',
      
      // Footer
      allRightsReserved: 'All rights reserved',
      
      // Messages
      messageSuccess: 'Message sent successfully!',
      messageError: 'Error sending message. Please try again.',
      loadingProperties: 'Loading properties...',
      loadingPropertyDetails: 'Loading property details...'
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
      clear: 'クリア',
      submit: '送信',
      back: '戻る',
      next: '次へ',
      previous: '前へ',
      viewDetails: '詳細を見る',
      
      // Navigation
      home: 'ホーム',
      properties: '物件',
      apartments: 'アパート',
      rooms: '部屋',
      favourites: 'お気に入り',
      contact: 'お問い合わせ',
      guide: 'ガイド',
      about: '会社概要',
      
      // Property
      apartment: 'アパート',
      room: '部屋',
      studio: 'スタジオ',
      house: '一軒家',
      price: '価格',
      priceRange: '価格帯',
      area: '面積',
      address: '住所',
      amenities: '設備',
      bedrooms: '寝室',
      bathrooms: 'バスルーム',
      floor: '階',
      available: '空室',
      featured: '特集',
      viewDescription: 'ビューの説明',
      petPolicy: 'ペット規約',
      
      // Search & Filter
      searchProperties: '物件検索',
      searchPlaceholder: '検索キーワードを入力...',
      propertyType: '物件タイプ',
      allTypes: 'すべてのタイプ',
      minPrice: '最低価格',
      maxPrice: '最高価格',
      minArea: '最小面積',
      maxArea: '最大面積',
      minBedrooms: '最少寝室数',
      maxBedrooms: '最大寝室数',
      featuredOnly: '特集のみ',
      applyFilter: 'フィルターを適用',
      clearFilter: 'フィルターをクリア',
      
      // Contact
      contactUs: 'お問い合わせ',
      fullName: '氏名',
      email: 'メールアドレス',
      phone: '電話番号',
      subject: '件名',
      message: 'メッセージ',
      sendMessage: 'メッセージを送信',
      contactInfo: '連絡先情報',
      
      // Favourites
      addToFavourites: 'お気に入りに追加',
      removeFromFavourites: 'お気に入りから削除',
      noFavourites: 'お気に入りの物件がありません',
      favouriteAdded: 'お気に入りに追加しました',
      favouriteRemoved: 'お気に入りから削除しました',
      
      // Property listing
      noPropertiesFound: '物件が見つかりません',
      showingResults: '{{total}}件中{{from}} - {{to}}件を表示',
      loadMore: 'もっと読み込む',
      
      // Currency & Units
      vnd: 'VND',
      sqm: 'm²',
      perMonth: '/月',
      million: '百万',
      billion: '十億',
      
      // Validation
      required: 'この項目は必須です',
      invalidEmail: '無効なメールアドレス',
      invalidPhone: '無効な電話番号',
      minLength: '最低{{min}}文字',
      maxLength: '最大{{max}}文字',
      
      // Company info
      companyName: '会社名',
      companyAddress: '会社住所',
      companyPhone: '会社電話',
      companyEmail: '会社メール',
      zaloContact: 'Zalo連絡先',
      
      // Footer
      allRightsReserved: 'すべての権利を保有',
      
      // Messages
      messageSuccess: 'メッセージが正常に送信されました！',
      messageError: 'メッセージの送信中にエラーが発生しました。もう一度お試しください。',
      loadingProperties: '物件を読み込み中...',
      loadingPropertyDetails: '物件詳細を読み込み中...'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem(STORAGE_KEYS.LOCALE) || DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n