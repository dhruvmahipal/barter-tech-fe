import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '737194284758-c9eutvgthupd9qhjoqa350vhj95n3aka.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
  },
  appId: 'com.bartertech.app',
  appName: 'Stirling Arms Hotel App',
  webDir: 'www',
  bundledWebRuntime: false,
};

// "SplashScreen": {
//       "launchShowDuration": 0
//     },

export default config;
