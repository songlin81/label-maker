import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "scan-qr": "Scan QR",
            "save-qr": "Save QR"
        }
    },
    pl: {
        translation: {
            "scan-qr": "Zeskanuj kod QR",
            "save-qr": "Zapisz kod QR"
        }
    }
};

const DETECTION_OPTIONS = {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
};

i18n
.use(initReactI18next)
.use(LanguageDetector)
.init({
    detection: DETECTION_OPTIONS,
    resources,
    // lng: 'pl',
    fallbackLng: 'en'
});

export default i18n;