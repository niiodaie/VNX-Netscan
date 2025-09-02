export interface UserLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  timezone: string;
  latitude: number;
  longitude: number;
  org: string;
  asn: string;
  demo?: boolean;
}

export interface Translation {
  [key: string]: {
    detecting: string;
    location: string;
    timezone: string;
    provider: string;
    network: string;
    coordinates: string;
    error: string;
    failed_detection: string;
  };
}

export const translations: Translation = {
  en: {
    detecting: "Detecting your location...",
    location: "Your Location",
    timezone: "Timezone",
    provider: "ISP Provider",
    network: "Network",
    coordinates: "Coordinates",
    error: "Error",
    failed_detection: "Failed to detect location"
  },
  es: {
    detecting: "Detectando tu ubicación...",
    location: "Tu Ubicación",
    timezone: "Zona Horaria",
    provider: "Proveedor ISP",
    network: "Red",
    coordinates: "Coordenadas",
    error: "Error",
    failed_detection: "Error al detectar ubicación"
  },
  fr: {
    detecting: "Détection de votre emplacement...",
    location: "Votre Emplacement",
    timezone: "Fuseau Horaire",
    provider: "Fournisseur ISP",
    network: "Réseau",
    coordinates: "Coordonnées",
    error: "Erreur",
    failed_detection: "Échec de la détection de l'emplacement"
  },
  de: {
    detecting: "Standort wird erkannt...",
    location: "Ihr Standort",
    timezone: "Zeitzone",
    provider: "ISP-Anbieter",
    network: "Netzwerk",
    coordinates: "Koordinaten",
    error: "Fehler",
    failed_detection: "Standorterkennung fehlgeschlagen"
  },
  zh: {
    detecting: "正在检测您的位置...",
    location: "您的位置",
    timezone: "时区",
    provider: "ISP 提供商",
    network: "网络",
    coordinates: "坐标",
    error: "错误",
    failed_detection: "位置检测失败"
  },
  ja: {
    detecting: "位置を検出中...",
    location: "あなたの場所",
    timezone: "タイムゾーン",
    provider: "ISPプロバイダー",
    network: "ネットワーク",
    coordinates: "座標",
    error: "エラー",
    failed_detection: "位置検出に失敗しました"
  },
  ar: {
    detecting: "جاري اكتشاف موقعك...",
    location: "موقعك",
    timezone: "المنطقة الزمنية",
    provider: "مزود خدمة الإنترنت",
    network: "الشبكة",
    coordinates: "الإحداثيات",
    error: "خطأ",
    failed_detection: "فشل في اكتشاف الموقع"
  },
  sw: {
    detecting: "Inatambua mahali ulipo...",
    location: "Mahali Ulipo",
    timezone: "Saa za Eneo",
    provider: "Mtoa Huduma wa Mtandao",
    network: "Mtandao",
    coordinates: "Kuratibu",
    error: "Hitilafu",
    failed_detection: "Imeshindwa kutambua mahali"
  },
  pt: {
    detecting: "Detectando sua localização...",
    location: "Sua Localização",
    timezone: "Fuso Horário",
    provider: "Provedor ISP",
    network: "Rede",
    coordinates: "Coordenadas",
    error: "Erro",
    failed_detection: "Falha ao detectar localização"
  },
  ru: {
    detecting: "Определение вашего местоположения...",
    location: "Ваше Местоположение",
    timezone: "Часовой Пояс",
    provider: "ISP Провайдер",
    network: "Сеть",
    coordinates: "Координаты",
    error: "Ошибка",
    failed_detection: "Не удалось определить местоположение"
  },
  hi: {
    detecting: "आपका स्थान पता लगाया जा रहा है...",
    location: "आपका स्थान",
    timezone: "समय क्षेत्र",
    provider: "ISP प्रदाता",
    network: "नेटवर्क",
    coordinates: "निर्देशांक",
    error: "त्रुटि",
    failed_detection: "स्थान का पता लगाने में विफल"
  }
};

export const detectUserLanguage = (): string => {
  // Get browser language, fallback to English
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Return supported language or fallback to English
  return translations[langCode] ? langCode : 'en';
};

export const getUserLocation = async (): Promise<UserLocation> => {
  try {
    // Use the server-side proxy endpoint to avoid CORS issues
    const response = await fetch('/api/geolocation');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we got an error response
    if (data.error) {
      throw new Error(data.message || 'API returned error');
    }
    
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      country_code: data.country_code,
      timezone: data.timezone,
      latitude: data.latitude,
      longitude: data.longitude,
      org: data.org,
      asn: data.asn,
      demo: data.demo || false
    };
  } catch (error) {
    console.error('Failed to detect user location:', error);
    throw new Error('Location detection service is currently unavailable.');
  }
};