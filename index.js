

import {db} from './firebaseConfig.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";



const postMoviesButton= document.querySelector('#postMoviesButton');
const getMoviesButton=document.querySelector('#getMoviesButton');
const moviesElem=document.querySelector('#movies')

async function postMoviesToFirebase(movie)
{
    try{
        const moviesRef = collection(db, 'Movies');
        const moviesSnapshot = await getDocs(moviesRef);
        const movies = [];
        moviesSnapshot.forEach((doc)=>{
            movies.push(doc.data().title.toLowerCase());
        });
        
        const movieTitle= movie.title.toLowerCase();
        if(!movies.includes(movieTitle)){
            await addDoc(moviesRef,movie);
            console.log('Movie added successfully!');  
        }
        else{
            console.log('This movie exist already!');
        }
    }catch (error){
        console.log(`ERROR: ${error}`);
    }
}

/**/postMoviesButton.addEventListener('click',async ()=> {
    console.log("Post Movies button clicked.");
    const movie= {
        title: document.querySelector('#titlePost').value,
        genre: document.querySelector('#genre').value,
        releaseDate: document.querySelector('#releaseDate').value,
        /*watched: false */ 
    };
    await postMoviesToFirebase(movie);
    
});


/**/async function getMovies(){
    console.log("Fetching movies from Firestore...");
    try {    
        const moviesRef = collection(db, 'Movies');
        const querySnapshot = await getDocs(moviesRef);
        const movies = [];
            querySnapshot.forEach((doc)=>{
          
            movies.push({ id: doc.id, ...doc.data() });
        });
            return movies;
        }catch(error)
        {
            console.log( `ERROR: ${error}`);
        }
}

/**/getMoviesButton.addEventListener('click', async ()=>{
    console.log("Get Movies button clicked.");
   
    const movies = await getMovies();
    displayMovies(movies);
})



function createMovieElement(movie)
{
    const containerElem=document.createElement('article');
    const headingElem = document.createElement('h3');
    const watched= movie.watched? 'watched' : 'Not watched';

    headingElem.addEventListener('click',async ()=>{
        const confirmed= confirm(`Have you seen the "${movie.title}" movie? Click:
        - OK for: Watched
        - Cancel for: Not Watched`);
        if (confirmed)
        {
            await haveWatched(movie.id, true);
            movie.watched= true;
        }
        else{
            await haveWatched(movie.id, false);
            movie.watched= false;
        }
    });

    headingElem.innerText = `Title: ${movie.title} - ${watched}`;

    const textElem1 = document.createElement('h4');
    const textElem2 = document.createElement('h4');
    const updateInputTitle = document.createElement('input');
    updateInputTitle.addEventListener('input',()=>{
        movie.title = updateInputTitle.value;
    })
    const updateInputGenre = document.createElement('input');
    const updateInputReleaseDate = document.createElement('input');
    const removeButton = document.createElement('button');
   
    const updateButton = document.createElement('button');

    headingElem.innerText=`Title: - ${movie.title} -`;
    textElem1.innerText = `Genre: - ${movie.genre } -`;
    textElem2.innerText = `ReleaseDate: - ${movie.releaseDate} -`;
    updateInputTitle.setAttribute('placeholder', 'Enter Title')
    updateInputTitle.setAttribute('id', 'updateInputTitle');
    updateInputGenre.setAttribute('placeholder', 'Enter Genre');
    updateInputGenre.setAttribute('id', 'updateInputGenre');
    updateInputReleaseDate.setAttribute('placeholder', 'Enter ReleaseDate');
    updateInputReleaseDate.setAttribute('id', 'updateInputReleaseDate');
   
    updateButton.innerText = 'Uppdate Movie';
    removeButton.innerText = 'Delete Movie';


containerElem.append(headingElem);
containerElem.append(textElem1);
containerElem.append(textElem2);
containerElem.append(updateInputTitle);
containerElem.append(updateInputGenre);
containerElem.append(updateInputReleaseDate);

/*containerElem.append(updateInput);*/
containerElem.append(updateButton);
containerElem.append(removeButton);
moviesElem.append(containerElem);

containerElem.append(watched);


removeButton.addEventListener('click',()=> {
    const movieId= movie.id;
    deleteMovie(movieId);
    containerElem.remove();
 });
 updateButton.addEventListener('click',async()=>{
    /*const updatedMovie= emptyInputs();*/
    const movieId = movie.id;
    updateData(movieId,  updateInputTitle.value, updateInputGenre.value, updateInputReleaseDate.value);
});
}

function emptyInputs()
{
    const updatedMovie={}
    if( updateInputTitle.value !=='')
    {
        updatedMovie.title=updateInputTitle.value;
    }
    if(  updateInputGenre.value !=='')
    {
        updatedMovie.genre = updateInputGenre.value;
    }
    if( updateInputReleaseDate.value !=='')
    {
        updatedMovie.releaseDate = updateInputReleaseDate.value;
    }
    return updatedMovie;
}

    function displayMovies(movies) {
        console.log("Displaying movies...");
        moviesElem.innerHTML = "";
       
            if (movies.length===0){
                const containerElem=document.createElement('article');
                const textElem3 = document.createElement('p');
                textElem3.innerText = `There is no movies in database`;
                containerElem.append(textElem3);
                moviesElem.append(containerElem);
            }
            else
            {   movies.forEach((movie)=>
                { createMovieElement(movie)
            });
    }
    }


    async function haveWatched(movieId,status)
    {
        try{
            const moviesRef = doc(collection(db, 'Movies'), movieId);
            await updateDoc(moviesRef, { watched: status });
         console.log("Watched status updated!");
        }catch (error) {
        console.error("Error updating watched status: ", error);
    }
    }


async function deleteMovie(id){
    
    try{
        const moviesRef = collection(db, 'Movies');
        await deleteDoc(doc(moviesRef,id));
        console.log("Movie deleted succesfully");
    } catch(error){
        console.error("Error deleting movie: ", error);
    }
}

/*async function updateMovie(updatedMovie, id) {
    try {
        const moviesRef = doc(collection(db, 'Movies'), id);
        await updateDoc(moviesRef, updatedMovie);
        console.log("Movie Updated!");
    } catch (error) {
        console.error("Error updating movie: ", error);
    }
}*/
/*async function updateMovie(updatedMovie, id) {
    try {
        const moviesRef = doc(collection(db, 'Movies'), id);

       
        const hasUpdates = Object.values(updatedMovie).some((value) => {
            return value !== undefined && value !== '';
        });

        if (hasUpdates) {
            await updateDoc(moviesRef, updatedMovie);
            console.log("Movie Updated!");
        } else {
            console.log("No valid updates found.");
        }
    } catch (error) {
        console.error("Error updating movie: ", error);
    }*/

// Modify updateMovie function
/*async function updateMovie(movieId, status) {
    try {
        const moviesRef = doc(collection(db, 'Movies'), movieId);
        await updateDoc(moviesRef, { watched: status });
        console.log('Movie updated!');
    } catch (error) {
        console.error('Error updating movie: ', error);
    }
}*/

function updateData(movieId, updatedTitle, updatedGenre, updatedReleaseDate){
    const movieRef = doc(db, 'Movies', movieId);

    updateDoc(movieRef, {
        title: updatedTitle,
        genre: updatedGenre,
        releaseDate: updatedReleaseDate
    })
    .then(() => {
        alert("Update successful");
    })
    .catch((error) => {
        alert("Error: " + error);
    });
}





