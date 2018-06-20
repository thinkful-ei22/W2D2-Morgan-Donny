'use strict';


const store = (function () {
  
  const videos= [];
  const nextPage ='';
  const currentPage ='';
  const prevPage ='';
  const searchTerm ='';

  const addVideosToStore = function(videos){
    this.videos = videos;
  }; 
  
  return{
    videos,
    addVideosToStore,
    nextPage,
    currentPage,
    prevPage,
    searchTerm
  };
} () );
  