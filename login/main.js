import {
    firebaseConfig,
    initializeApp,
    getFirestore,
    onAuthStateChanged,
    getAuth,
    createUserWithEmailAndPassword,
    collection,
    addDoc,
    getDocs,
    app,
    auth,
    db,
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    storageRef,
    storage,
    signInWithEmailAndPassword
} from "/utils/utils.js";



const login_email = document.getElementById('login_email');
const login_password = document.getElementById('login_password');
const login_btn = document.getElementById('login_btn');
const login_form = document.getElementById('login_form');


onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log('logged in');
        window.location.pathname = '../index.html'
    } else {
        console.log('not logged in');
    }
});


login_form.addEventListener('submit', ((e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, login_email.value, login_password.value)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Wrong Credentials'
            });
        });
}));