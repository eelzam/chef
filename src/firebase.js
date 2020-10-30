import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: '${{ secrets.FIREBASE_APIKEY }}',
  authDomain: '',
  databaseURL: '',
  projectId: 'chef-3e027',
  storageBucket: '',
  messagingSenderId: '',
  appId: '${{ secrets.FIREBASE_CHEF_3E027_APPID }}'
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const deletedCollection = db.collection('deletedPost')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  deletedCollection
}
