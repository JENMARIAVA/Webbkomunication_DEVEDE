//denna module fokuserar till att user skriva en film spara det om det inte redan finns,
 // delvis hanterar processen att läggaupp filmer

import { db } from './firebaseConfig.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


const postMoviesButton= document.querySelector('#postMoviesButton');
const moviesElem=document.querySelector('#movies')

async function postMoviesToFirebase(movie){
    try{
        console.log('Attempting to add movie to Firebase:', movie);
        const moviesRef = collection(db, 'Movies');
        const moviesSnapshot = await getDocs(moviesRef);
        const movies = [];

        moviesSnapshot.forEach((doc) => {
            movies.push(doc.data().title.toLowerCase());
        });
       
        const movieTitle = movie.title.trim().toLowerCase();
        const isTitleEmpty = movieTitle === '';
        if(isTitleEmpty){ 
            alert('Fill in the input with a movie title');
            console.log('Fill in the input with a movie title');
            return; 
        }
        if (!movies.includes(movieTitle)){
            await addDoc(moviesRef,movie);
            console.log('Movie added successfully!');
        } 
        else{ 
            const containerElem=document.createElement('article');
            const textElem3 = document.createElement('p');
            textElem3.innerText = `This movie exist already!`;
            containerElem.append(textElem3);
            moviesElem.append(containerElem);
            console.log('This movie exist already!');
        }
    }
    catch (error){
        console.log(`ERROR: ${error}`);
    }
}

postMoviesButton.addEventListener('click',async ()=> {
    console.log("Post Movies button clicked.");
    const movie= {
        title: document.querySelector('#titlePost').value,
        genre: document.querySelector('#genre').value,
        releaseDate: document.querySelector('#releaseDate').value,
    };
    await postMoviesToFirebase(movie);
});

export { postMoviesToFirebase, postMoviesButton,moviesElem };