import {
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
    where,
    updateDoc
} from '../utils/utils.js';



const selectedRecipe = localStorage.getItem('selectedRecipe');
const recipe_title = document.getElementById('recipe_title');
const recipe_ingredients = document.querySelector('.ingredients p');
const recipe_procedure = document.querySelector('.procedure p');
const recipe_image = document.querySelector('.right img');
const menu = document.querySelector('.menu');
const menu_btn = document.getElementById('menu_btn');


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('logged in');
        let y = `${await getProfilePic(uid)}`;
        console.log(y);
    } else {
        console.log('not logged in');
        window.location.pathname = 'login/index.html';
    }
});


home_btn.addEventListener('click', (() => {
    window.location.pathname = '../index.html';
}));

my_recipe_btn.addEventListener('click', (() => {
    window.location.pathname = '../my profile/index.html';
}))


async function getProfilePic(uid) {
    const q = query(collection(db, "userInfo"), where("uid", "==", uid));

    let x;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        x = doc.data().profilePic;
    });
    return x;
}


async function getRecipe(selectedRecipe) {
    const q = query(collection(db, "Recipe"), where("recipeId", "==", selectedRecipe));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        recipe_image.src = doc.data().foodImage;
        recipe_title.innerText = doc.data().foodTitle;
        recipe_ingredients.innerText = doc.data().foodIngredients;
        recipe_procedure.innerText = doc.data().foodProcedure;
    });
}
getRecipe(selectedRecipe);


menu_btn.addEventListener('click', (() => {
    menu.style.display = 'flex';
}));


menu.children[0].addEventListener('click', (() => {
    window.location.pathname = '../index.html'
}));

menu.children[2].addEventListener('click', (() => {
    window.location.pathname = '../my profile/index.html'
}));

menu.children[4].addEventListener('click', (() => {
    window.location.pathname = '../add recipe/index.html'
}));

menu.children[6].addEventListener('click', (() => {
    signOut(auth)
        .then(() => {
            console.log('Logged Out');
        })
        .catch((error) => {
        });
}));


let isMenuOpen = false;
menu_btn.addEventListener('click', (() => {
    if (isMenuOpen) {
        menu.style.display = 'none';
        isMenuOpen = false;
    } else {
        menu.style.display = 'flex';
        isMenuOpen = true;
    }
}));