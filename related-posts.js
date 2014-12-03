/*
 *   In-Link Widget Code version 2.0
 *   
 *   Copyright (c) 2011, Gayspirit - http://tech.gayspirit.me/in-link
 *   Based on the Work by Eduardo Miranda - http://code.google.com/p/relposts/
 *
 *   Changelog:
 *   1.0 - Initial Release
 *   2.0 - Release to exploit the Api v.2. release.
 * 
 *   All rights reserved.
 *
 *   In-Link is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   In-Link is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with Tumblr In-Link.  If not, see <http://www.gnu.org/licenses/>.
 *
*/

                        (function(s) {
                            var titles = [];
                            var links = [];
                            var images = [];
                            var notes = [];
                            var captions = [];
                            var postTags = [];
                            var items = [];
                            var types = [];
                            var $jo = jQuery.noConflict()
            
                            var config = {
                                'num': 6,
                                'len': 60,
                                'size': 500,
                                'title': '',
                                'tags': '{block:Tags}{Tag},{/block:Tags}',
                                'type': ''
                            }
                            if(typeof(config.tags)=='undefined'){ error(0); return; }
                            if(typeof(config.imageurl)=='undefined'){ config.imageurl='http://tumblr-in-link.googlecode.com/svn/branches/Version 2.0/img/placeholder.jpg'; }
                            
                            
                            var loadingDiv = 
                                '<div id="content" class="content">'+
                                    '<div class="content-inner" id="related-posts">'+
                                        '<div id="loading" class="loading">Loading related articles...</div>'+
                                    '</div>'+
                                '</div>';
                            
                            
                            var tags = config.tags.slice(0,-1).split(',');
            
                            $jo(document).ready(function() {
                                
                                
                                function getRelated() {
                                    var req;
                                    for(var i=0; i<tags.length; i++){
                                        req=$jo.getJSON('http://api.tumblr.com/v2/blog/'+document.domain+'/posts?api_key=VspHunyBAE3ZhmnivmJ7F8AMZX84Ptz96XCHGCdCRyg0DLNKif&limit='+config.num+'&offset=0&type='+config.type+'&tag='+escape(tags[i])+'&jsonp=?', 
                                        function(pippo) {
                                            $jo(pippo.response.posts).each(function(i, post) {
                                                /*Set Text*/
                                                var text='';
                                                if(post.type=='text') text+=post['title'];
                                                else if(post.type=='link') text+=post['title'];
                                                else if(post.type=='chat') text+=post['body'];
                                                else if(post.type=='quote') text+=post['text'];
                                                else if(post.type=='photo') text+=post['caption'];
                                                else if(post.type=='video') text+=post['caption'];
                                                else if(post.type=='audio') text+=post['caption'];
                                                else if(post.type=='answer') text+=post['question'];
            
                                                /*Strip HTML from text*/
                                                var StrippedText = text.replace(/(<([^>]+)>)/ig,"");
            
                                                /*slice text to the desired length*/
                                                if(StrippedText.length>config.len){ 
                                                    StrippedText=StrippedText.slice(0,config.len); StrippedText+='...';
                                                }
            
                                                /*get images*/
                                                var image ='';
            
                                                /*If article, try to get the first image out of the body*/
                                                if(post.type=='text'){
                                                    var fullbody = post.body;
                                                    var fullbodyset = $jo(fullbody);
                                                    image += fullbodyset.find('img').attr('src');
                                                }
                                                
                                                /*If audio, get the album cover if available*/
                                                else if(post.type=='audio'){
                                                    image+=this.album_art;
                                                }
                                                else if(post.type=='photo'){
                                                    image+= this.photos[0]['alt_sizes'][0]['url'];
                                                    // /*Loop to the various photos data, and make sure to select only the first in case of a slideshow*/
                                                    // $jo(this.photos[0]).each(function(i, photo) {
                                                    //     /*Loop through the various photo size to get the thumbnail information*/
                                                    //     $jo(this.alt_sizes).each(function(i, alt_size) {
                                                    //         if(config.size=='75') {
                                                    //             if(alt_size.width=='75') {image+=alt_size['url'];}
                                                    //         }
                                                    //         if(config.size=='100') {
                                                    //             if(alt_size.width=='100') {image+=alt_size['url'];}
                                                    //         }
                                                    //         if(config.size=='250') {
                                                    //             if(alt_size.width=='250') {image+=alt_size['url'];}
                                                    //         }
                                                    //         if(config.size=='500') {
                                                    //             if(alt_size.width=='500') {image+=alt_size['url'];}
                                                    //         }
                                                    //     });  
                                                    // });
                                                }
                                            
                                                /*For other types, use the standard image*/
                                                else if(post.type=='link') image += 0
                                                else if(post.type=='chat')  image += 0
                                                else if(post.type=='quote')  image += 0
                                                else if(post.type=='photo')  image += 0
                                                else if(post.type=='answer')  image += 0;
                                        
                                                /*Manage Exceptions*/
                                                if(image==0){image=config.imageurl; }
                                                else if(image=='undefined'){image=config.imageurl; };
                                        
                                                /*Set Notes*/
                                                console.log('post', post);
                                                var note ='';
                                                note+=post['note_count'];
                                                if(note=='undefined'){note='0'; };
                                        
                                                /*Set Tags*/
                                                var postTag ='';
                                                postTag+=post['tags'][0];
                                                if(postTag=='undefined'){postTag=''; };
                                                
                                                /*Set Captions*/
                                                var caption ='';
                                                caption+=post['caption'];
                                                if(caption=='undefined'){caption=''; };
                                        
                                                /*Transfer pieces*/
                                                images.push(image);
                                                titles.push(StrippedText);
                                                links.push(post['post_url']); 
                                                types.push(post['type']);
                                                notes.push(note);
                                                postTags.push(postTag);
                                                captions.push(caption);
                                            });
                                
                                        }).complete(getList);
                                    }
                                }
                                function getList(){
                                    for(var i=0; i<titles.length; i++){
                                        var regex = new RegExp('('+links[i]+')');
                                        // var html = $jo("#inlink-list").html();
                                        var html = $jo("#related-posts").html();
                                
                                        if(links[i]!=document.location&&!html.match(regex)){
                                            if(config.num--<=0) return;
                                        
                                            var article = 
                                                '<article class="item-outer photo-item" style="background-image: url(\''+images[i]+'\');" >'+
                                                    '<div class="item-inner">'+
                                                        '<div class="main-tag">'+
                                                            '<p>'+postTags[i]+'</p>'+
                                                        '</div>'+
                                                        '<div class="main-separation">'+
                                                        '</div>'+
                                                        '<div class="main-caption">'+
                                                            '<a href="'+links[i]+'">'+captions[i]+'</a>'+
                                                        '</div>'+
                                                        '<a href="'+links[i]+'"><span class="main-link"></span></a>'+
                                                    '</div>'+
                                                '</article>';
                                            
                                            $jo("#related-posts").append(article);
                                            
                                        }
                                    }
                                    $jo("#loading").remove();
                                    if(links.length==0) hideall();
                                    console.log(links);
                                    // $jo("#inlink-title").html('<h2>'+config.title+'</h2>');
                                    // $jo("#inlink-loading").html('');
                                }
            
                                // ACTIONS CALLED HERE:
                                $jo('#related-posts-outer').append(loadingDiv);
                                getRelated();
                                
                            });
            
                            function getError(e){
                                var msg="error: ";
                                switch(e){
                                    case 0: msg+='no tags defined'; break;
                                    case 1: msg+='tumblr API problem'; break;
                                    case 2: msg+='tumblr problem'; break;
                                }
                                $jo("#inlink-loading").html(msg);
                                ////////////////
                            }
                            
                            function hideall(){
                                $jo('#loading').hide();
            
                            }
                        })(jQuery);