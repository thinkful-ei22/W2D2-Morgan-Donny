/*global store, videoList */
'use strict';


const api = (function() {

  const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
  const API_KEY = 'AIzaSyDNzYmcCbATvwIgvnme3g_StFZ9a17CkOA';

  const fetchVideos = function(searchTerm,callback){
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
     
    } );
  };

  return{
    decorateResponse,
    fetchVideos
  };
}());