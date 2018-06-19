'use strict';

const API_KEY = 'AIzaSyDNzYmcCbATvwIgvnme3g_StFZ9a17CkOA';

/*
  We want our store to hold a `videos` array of "decorated" objects - i.e. objects that
  have been transformed into just the necessary data to display on our page, compared to the large
  dataset Youtube will deliver to us.  Example object:
  
  {
    id: '98ds8fbsdy67',
    title: 'Cats dancing the Macarena',
    thumbnail: 'https://img.youtube.com/some/thumbnail.jpg'
  }

*/
const store = {
  videos: [],
  nextPage:'',
  currentPage:'',
  prevPage:'',
  searchTerm:''
};

// TASK: Add the Youtube Search API Base URL here:
// Documentation is here: https://developers.google.com/youtube/v3/docs/search/list#usage
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

// TASK:
// 1. Create a `fetchVideos` function that receives a `searchTerm` and `callback`
// 2. Use `searchTerm` to construct the right query object based on the Youtube API docs
// 3. Make a getJSON call using the query object and sending the provided callback in as the last argument
// TEST IT! Execute this function and console log the results inside the callback.
const fetchVideos = function(searchTerm=store.searchTerm, callback) {
  const settings = {
    url: BASE_URL,
    data: {
      key: API_KEY,
      part: 'snippet',
      q: searchTerm,
      type:'video',
      pageToken: store.currentPage
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  return $.ajax(settings);
  
};

// TASK:
// 1. Create a `decorateResponse` function that receives the Youtube API response
// 2. Map through the response object's `items` array
// 3. Return an array of objects, where each object contains the keys `id`, `title`, 
// `thumbnail` which each hold the appropriate values from the API item object. You 
// WILL have to dig into several nested properties!
// TEST IT! Grab an example API response and send it into the function - make sure
// you get back the object you want.
const decorateResponse = function(response) {
  // console.log(response);
  store.nextPage = response.nextPageToken;
  store.prevPage = response.prevPageToken;
  //console.log(store.PrevPage);
  //console.log(store.page);
  return response.items.map( item => {
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnailURL: item.snippet.thumbnails.high.url,
      channelId: item.snippet.channelId
    };    
    // return videoObj;
    // return videos;
    //store.videos.push(videoObj);
    //console.log(videoObj);
  } );

  //addVideosToStore(videos);
  //return videos;
  //console.logthe(videos);
  //addVideosToStore(videos);
};

// TASK:
// 1. Create a `generateVideoItemHtml` function that receives the decorated object
// 2. Using the object, return an HTML string containing all the expected data
// TEST IT!
const generateVideoItemHtml = function(video) {
  return `
    <li class="js-item-index-element" data-item-id="${video.id}">
      <p class="js-video-title">${video.title}</p>
      <span class="video-thumb"><a href="https://www.youtube.com/watch?v=${video.id}" data-lity><img src='${video.thumbnailURL}'></a></span>
       <p class="js-video-channellink"><a href="https:/www.youtube.com/channel/${video.channelId}" target="_blank">Visit original channel</a></p>
      </li>`;

};

// TASK:
// 1. Create a `addVideosToStore` function that receives an array of decorated video 
// objects and sets the array as the value held in store.videos
// TEST IT!
const addVideosToStore = function(videos) {
  store.videos = videos;
  render();
  //console.log(store.videos);
};

// TASK:
// 1. Create a `render` function
// 2. Map through `store.videos`, sending each `video` through your `generateVideoItemHtml`
// 3. Add your array of DOM elements to the appropriate DOM element
// TEST IT!
const render = function() {
  const videosList = store.videos.map(video => generateVideoItemHtml(video));

  $('.results').html(videosList);

};

// TASK:
// 1. Create a `handleFormSubmit` function that adds an event listener to the form
// 2. The listener should:
//   a) Prevent default event
//   b) Retrieve the search input from the DOM
//   c) Clear the search input field
//   d) Invoke the `fetchVideos` function, sending in the search value
//   e) Inside the callback, send the API response through the `decorateResponse` function
//   f) Inside the callback, add the decorated response into your store using the `addVideosToStore` function
//   g) Inside the callback, run the `render` function 
// TEST IT!
const handleFormSubmit = function() {
  $('form').on('click', '[type=submit]', event => {
    event.preventDefault();
    store.searchTerm = $('#search-term').val();
    $('#search-term').val('');
    store.currentPage='';
   // fetchVideos(store.searchTerm, decorateResponse);
    fetchVideos(store.searchTerm, function(response){
      const videos = decorateResponse(response);
      addVideosToStore(videos);
      render();
    });
    // fetchVideos(searchItems, )
    //console.log(videos);
    
   
  });
};


const handleNextPageButton= function(){
  $('.buttons').on('click', '.nextPageButton', () => {
    //event.preventDefault();
    console.log('button works');
    store.currentPage = store.nextPage;
    fetchVideos(store.searchTerm, function(response){
      const videos = decorateResponse(response);
      addVideosToStore(videos);
      render();
    });

  });
}

const handlePrevPageButton= function(){
  $('.buttons').on('click', '.prevPageButton', () => {
    //event.preventDefault();
    console.log('button works');
    store.currentPage = store.prevPage;
    fetchVideos(store.searchTerm, function(response){
      const videos = decorateResponse(response);
      addVideosToStore(videos);
      render();
    });

  });
}



const firstLoad=function(){
  store.searchTerm='Cyberpunk 1990';
  fetchVideos(store.searchTerm, function(response){
    const videos = decorateResponse(response);
    addVideosToStore(videos);
    render();
  });

}


// When DOM is ready:
$(function () {
  firstLoad();
  handleFormSubmit();
  render();
  handleNextPageButton();
  handlePrevPageButton();
  // TASK:
  // 1. Run `handleFormSubmit` to bind the event listener to the DOM
});
