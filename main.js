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
    query,
    where,
    signOut
} from "/utils/utils.js";


const profile_pic = document.getElementById('profile_pic');
const recipe_overview = document.querySelector('.recipe-overview');
const menu = document.querySelector('.menu');
const menu_btn = document.getElementById('menu_btn');
const home_btn = document.getElementById('home_btn');
const my_recipe_btn = document.getElementById('my_recipe_btn');
const logout_btn = document.getElementById('logout_btn');


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('logged in');
        let y = `${await getProfilePic(uid)}`;
        console.log(y);
        profile_pic.src = y;

    } else {
        console.log('not logged in');
        window.location.pathname = 'login/index.html';
    }
});


async function getProfilePic(uid) {
    const q = query(collection(db, "userInfo"), where("uid", "==", uid));

    let x;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        x = doc.data().profilePic;
    });
    return x;
}


async function getRecipes() {
    const querySnapshot = await getDocs(collection(db, "Recipe"));

    let x = '';
    querySnapshot.forEach((doc) => {
        x += `
                    <div class="recipe-card" id="${doc.data().recipeId}">
                        <img src="${doc.data().foodImage}">
                        <div class="texts">
                            <div class="recipe-title">${doc.data().foodTitle}</div>
                            <div class="recipe-by">Recipe by <b>${doc.data().recipeByUsername}</b></div>
                        </div>
                    </div>
        `

        console.log(doc.data().foodImage);
    });

    recipe_overview.innerHTML = x;

    const recipe_cards = document.querySelectorAll('.recipe-card');

    recipe_cards.forEach((card) => {
        card.addEventListener('click', function () {
            localStorage.setItem('selectedRecipe', this.id);

            window.location.pathname = '/view recipe/index.html';
        });
    });
}
getRecipes();


my_recipe_btn.addEventListener('click', (() => {
    window.location.pathname = '/my profile/index.html';
}));


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
    if (isMenuOpen){
        menu.style.display = 'none';
        isMenuOpen = false;
    } else {
        menu.style.display = 'flex';
        isMenuOpen = true;
    }
}));


logout_btn.addEventListener('click', (() => {
    signOut(auth)
        .then(() => {
            console.log('Logged Out');
        })
        .catch((error) => {
        });
}));