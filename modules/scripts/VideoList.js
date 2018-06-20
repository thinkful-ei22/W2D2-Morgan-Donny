/*global store, api*/

'use strict';

const videoList = (function(){  
    
  const generateVideoItemHtml = function(video) {
    return `
            <li class="js-item-index-element" data-item-id="${video.id}">
              <p class="js-video-title">${video.title}</p>
              <span class="video-thumb"><a href="https://www.youtube.com/watch?v=${video.id}" data-lity><img src='${video.thumbnailURL}'></a></span>
               <p class="js-video-channellink"><a href="https:/www.youtube.com/channel/${video.channelId}" target="_blank">Visit original channel</a></p>
              </li>`;
        
  };
      
  const render = function() {
    const videosList = store.videos.map(video => generateVideoItemHtml(video));
        
    $('.results').html(videosList);
        
  };

  const handleFormSubmit = function() {
    $('form').on('click', '[type=submit]', event => {
      event.preventDefault();
      store.searchTerm = $('#search-term').val();
      $('#search-term').val('');
      store.currentPage='';
      // fetchVideos(store.searchTerm, decorateResponse);
      api.fetchVideos(store.searchTerm, function(response){
        const videos = api.decorateResponse(response);
        store.addVideosToStore(videos);
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
      api.fetchVideos(store.searchTerm, function(response){
        const videos = api.decorateResponse(response);
        store.addVideosToStore(videos);
        render();
      });

    });
  };

  const handlePrevPageButton= function(){
    $('.buttons').on('click', '.prevPageButton', () => {
    //event.preventDefault();
      console.log('button works');
      store.currentPage = store.prevPage;
      api.fetchVideos(store.searchTerm, function(response){
        const videos = api.decorateResponse(response);
        store.addVideosToStore(videos);
        render();
      });

    });
  };



  const firstLoad=function(){
    store.searchTerm='Cyberpunk 1990';
    api.fetchVideos(store.searchTerm, function(response){
      const videos = api.decorateResponse(response);
      store.addVideosToStore(videos);
      render();
    });

  };


  const bindEventListeners = function(){
    handleFormSubmit();
    handleNextPageButton();
    handlePrevPageButton();

  };

  return{
    firstLoad,
    bindEventListeners
  };



}());

