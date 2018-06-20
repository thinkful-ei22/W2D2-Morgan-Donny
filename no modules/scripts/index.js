/* global $ */
'use strict';


//private key to gain access to YouTube server
const API_KEY = 'AIzaSyDNzYmcCbATvwIgvnme3g_StFZ9a17CkOA';



//stores current state of search results
//will be referenced to insert HTML
const store = {
  videos: []
};



//base url for searching Youtube Data
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';



//makes an ajax call to search based on the given search term
const fetchVideos = function(searchTerm, callback) {
  const settings = {
    url: BASE_URL,
    data: {
      key: API_KEY,
      part: 'snippet',
      q: searchTerm,
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
  //.getJSON();

};




const decorateResponse = function(response) {
  return response.items.map( item => {
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnailURL: item.snippet.thumbnails.high.url
    };
  });
};




const generateVideoItemHtml = function(video) {
  return `
    <li class="js-item-index-element" data-item-id="${video.id}">
      <p class="js-video-title">${video.title}</p>
      <span class="video-thumb"><a href="https://www.youtube.com/watch?v=${video.id}"><img src='${video.thumbnailURL}'></a></span>
    </li>`;
};



const addVideosToStore = function(videos) {
  store.videos = videos;
};




const render = function() {
   const videosList = store.videos.map(video => generateVideoItemHtml(video));
  $('.results').html(videosList);

};


const handleResponse = function(response) {
  const filteredVideos = decorateResponse(response);
  addVideosToStore(filteredVideos);
  render();
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
    const searchItem = $('#search-term').val();
    $('#search-term').val('');
    fetchVideos(searchItem, handleResponse);
  });
};


// When DOM is ready:
$(function () {
  handleFormSubmit();
  render();
});
