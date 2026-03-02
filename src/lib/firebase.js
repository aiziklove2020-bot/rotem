import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD0FR_fcS9t8V6cWOmdgTS6XfKUB3xu1gw',
  authDomain: 'art-candle.firebaseapp.com',
  projectId: 'art-candle',
  storageBucket: 'art-candle.firebasestorage.app',
  messagingSenderId: '594257348060',
  appId: '1:594257348060:web:fc9cebba1d6bc98878fb19',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
