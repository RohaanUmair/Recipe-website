import {
    initializeApp,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    doc,
    updateDoc,
    where,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js"


export const firebaseConfig = {
    apiKey: "AIzaSyD3Jao1V3AREqcStTYgRvqPaxbjYhVPcGg",
    authDomain: "recipe-website-4dceb.firebaseapp.com",
    projectId: "recipe-website-4dceb",
    storageBucket: "recipe-website-4dceb.appspot.com",
    messagingSenderId: "627905426092",
    appId: "1:627905426092:web:ba6d17539cd64e5669a509"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const storageRef = ref(storage);
const auth = getAuth();


export {
    auth,
    getFirestore,
    initializeApp,
    getAuth,
    createUserWithEmailAndPassword,
    collection,
    addDoc,
    getDocs,
    app,
    db,
    getStorage,
    ref,
    storage,
    uploadBytes,
    getDownloadURL,
    storageRef,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    query,
    doc,
    where,
    updateDoc,
    deleteDoc,
}