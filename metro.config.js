// Konfigurasi Metro bawaan Expo + pemangkasan khusus web.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const KOSONG = path.resolve(__dirname, 'src/web-kosong.js');

// Keluarga daftar virtual (FlatList, SectionList, VirtualizedList) ikut terbawa karena expo-router (CommonJS)
// memuat seluruh indeks react-native-web. Aplikasi ini tidak memakainya, jadi di web diganti modul kosong.
const BUANG_WEB = /react-native-web\/dist\/(exports\/(FlatList|SectionList|VirtualizedList)|vendor\/react-native\/(FlatList|SectionList|VirtualizedList|VirtualizedSectionList|VirtualizeUtils|FillRateHelper|ViewabilityHelper)|vendor\/react-native\/Animated\/components\/Animated(FlatList|SectionList))(\/|\.js)/;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const hasil = context.resolveRequest(context, moduleName, platform);
  if (platform === 'web' && hasil && hasil.type === 'sourceFile' && BUANG_WEB.test(hasil.filePath)) {
    return { type: 'sourceFile', filePath: KOSONG };
  }
  return hasil;
};

module.exports = config;
