            Featured = {
              'apiNum' : 50, // how many posts to read
              'listId' : 'featured', // the id of the div to write to
              'tagName' : 'featured', // the name of the tag we're searching for
              'linkAppend' : '', // html to append to the end of each linked post
              
              'postDB' : [],
              'listPos' : 0,
              'doList' : function (where) {
                var innerDiv; var outerDiv = $('#'+where);
                var titles = {"link":"link-text", "photo":"photo-caption", "quote":"quote-text", "regular":"regular-title", "video":"video-caption"}
                
                // cycle through post database
                pcount = Featured.postDB.length;
                for (i=Featured.listPos; i<pcount; i++) {
                  p = Featured.postDB[i];
            
                  if (p[titles[p.type]] != '') {
                    titlestr = p[titles[p.type]].replace(/<\/?[^>]+>/gi, '');
                  } else {
                    titlestr = p['url']
                  };
                  
                  innerDiv = document.createElement('innerDiv');

                  $(innerDiv).html('<a class="'+p.type+'" href="'+p["url-with-slug"]+'">'+titlestr+Featured.linkAppend+'</a>');

                  outerDiv.append(innerDiv);
                  
                  Featured.listPos = pcount;
                }
              },
              'getData' : function() {
                $.get('/api/read/json?num='+Featured.apiNum+'&tagged='+Featured.tagName,
                  function(data) {
                    eval(data);
                    // for (i=0; i<tumblr_api_read.posts.length; i++) {
                    //   Featured.postDB.push(tumblr_api_read.posts[i]);
                    // }
                    Featured.postDB.push(tumblr_api_read.posts[0]);     // ONLY SHOW THE LAST FEATURED POST
                    Featured.doList(Featured.listId);
                  }
                );
              }
            };
            
            $(document).ready(function(){
              Featured.getData();
            });