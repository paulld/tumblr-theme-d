            /*
                TUMBLR FEATURED POSTS SCRIPT
                Automatically gets all posts tagged with "featured" and lists them
                REQUIRES JQUERY!
                --------------------------------------
                Created by james <at> bandit.co.nz
                http://blog.bandit.co.nz
                
                Some code borrowed from Jacob DeHart's AJAX Search:
                http://blog.bandit.co.nz/post/80415548/tumblr-ajax-inline-search
            */
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
                    console.log('pcount', pcount);

                    if (pcount > 0) {
                        $(outerDiv).show();
                        for (i=Featured.listPos; i<pcount; i++) {
                            p = Featured.postDB[i];

                            if (p[titles[p.type]] != '') {
                                titlestr = p[titles[p.type]].replace(/<\/?[^>]+>/gi, '');
                            } else {
                                titlestr = p['url'];
                            };
                            var url = "url('" + p["photo-url-500"] + "')";
                            $('#feature-image').css("background-image", url);
                            $('#feature-url1').attr("href", p["url-with-slug"]);
                            $('#feature-url2').attr("href", p["url-with-slug"]);
                            $('#feature-url3').attr("href", p["url-with-slug"]);
                            $('#feature-caption').html(p["photo-caption"]);

                            var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                            var date = monthNames[p["date-gmt"].slice(5,7)-1] + " " + p["date-gmt"].slice(8,11);
                            $('#feature-date').html(date);
                            $('#feature-tag').html(p["tags"][0]);
                            
                            
                            // innerDiv = document.createElement('innerDiv');

                            // $(innerDiv).html('<a class="'+Featured.tagName+'-'+p.type+'" href="'+p["url-with-slug"]+'">'+titlestr+Featured.linkAppend+'</a>');
                            console.log(p);
                            // outerDiv.append(innerDiv);

                            Featured.listPos = pcount;
                        }
                    } else {
                        $(outerDiv).hide();
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