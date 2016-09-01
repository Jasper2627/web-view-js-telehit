(function ($) {
    $.fn.renderHome = function () {
        var mixController = {
            sections : {'page':'','player':'','content':'', 'title':'', 'share':''},
            requests : {},
			contents : [],
            dict : {},
            aux: 0,
			getURL : {},
            cloneFavoriteSelect : '',
			isPlaying : '',
            dragging : {prev2:'',prev:'',current:'',next:'',next2:'',posX:0,posY:0,offsetX:0,offsetY:0},
            programs : { 'masterFeeds':{}, 'specialSection':{} },
            _init : function (container) {
                this.container = container;
				this.sections.title = this.container.find('.title');
                this.sections.page = this.container.find('.page');
                this.sections.player = this.container.find('.player');
                this.sections.content = this.container.find('.content');
				this.sections.programs = this.container.find('.programsContainer');
                this.sections.favorites = this.container.find('.sectionFavorite');
                this.sections.favorite = this.container.find('#favoriteContainer');
				this.sections.share = this.container.find('.share');
				this._initGETurl();
                this._initPrograms();
				this._initEvents();
				this._initSpecialSection();
                this._getMasterFeeds(this.programs['masterFeeds'], this.getURL);	
            },
            _key : function(obj){
                return obj;
            },

            _initPrograms : function(){
				//this.programs['masterFeeds'] = {'feed':['http://static-feeds.esmas.com/awsfeeds/networks/telehit/telehit.menu.js'],'callback':['telehit_menu']};
				//this;.programs['masterFeeds'] = {'feed':['http://admin.esmas.com.mx/feeds/telehit/telehit.menu.js'],'callback':['telehit_menu']};
				this.programs['masterFeeds'] = {'feed':['http://localhost/telehit/feedsTelehit/telehit.menu_local.js'],'callback':['telehit_menu']};
            },                              
            
            _trimLength : function(text, maxLength) {
               var ellipsis = "...";
                text = $.trim(text);
                if (text.length > maxLength) {
                    text = text.substring(0, maxLength - ellipsis.length)
                    return text.substring(0, text.lastIndexOf(" ")) + ellipsis;
                } else
                    return text;
            },
			
			_initGETurl : function(){				
				var loc = document.location.href;
				// si existe el interrogante
				if(loc.indexOf('?')>0)
				{
					// tomo la parte de la url que hay despues del interrogante
					var getString = loc.split('?')[1];
					// obtenemos un array con cada clave=valor
					var GET = getString.split('&');
					
					for(var i = 0, l = GET.length; i < l; i++){
						var tmp = GET[i].split('=');
						this.getURL[tmp[0]] = unescape(decodeURI(tmp[1]));
					}					
					return this.getURL;
				}
			},
			
			_initEvents : function(){
				this.container.on('click', '.item', function (){					
                    var type = $(this).data('type');
                    var data = {};
                    data.key = (typeof $(this).data('key') !== 'undefined')?$(this).data('key'):'';
                    data.high = (typeof $(this).data('high') !== 'undefined')?$(this).data('high'):'';
                    data.medium = (typeof $(this).data('medium') !== 'undefined')?$(this).data('medium'):'';
                    data.background = (typeof $(this).data('poster') !== 'undefined')?$(this).data('poster'):'';					
					data.poster = (typeof $(this).data('poster') !== 'undefined')?$(this).data('poster'):'';
					data.title = (typeof $(this).data('title') !== 'undefined')?$(this).data('title'):'';
					data.pubDate = (typeof $(this).data('pubdate') !== 'undefined')?$(this).data('pubdate'):'';
					data.content = (typeof $(this).data('content') !== 'undefined')?$(this).data('content'):''; 
                    data.section = (typeof $(this).data('section') !== 'undefined')?$(this).data('section'):'';                 
                    if(data.section != 'playerInShare'){
                        window.requestAnimationFrame(mixController._activatePlayer);
                    }else{
                        window.requestAnimationFrame(mixController._activatePlayerInShare);
                    }

                    setTimeout(function() {                        
                        mixController._renderPlayer(type,data);                        
                    },500);
                });

				this.container.on('click', '.programs', function(){
					var request = {};
					request.stage = (typeof $(this).data('stage')!== 'undefined')? $(this).data('stage'):'';
					request.feed = (typeof $(this).data('feed')!== 'undefined')? $(this).data('feed'):'';
					request.callback = (typeof $(this).data('callback')!== 'undefined')? $(this).data('callback'):'';
					mixController._getProgramsContent(request);                    
				});
				
				this.container.on('click', '.topPrograms', function(){
					window.requestAnimationFrame(mixController._inactivateVideoPrograms);					
				});
				
				this.container.on('click', '.player.playing .close', function (ev){                    
                    window.requestAnimationFrame(mixController._inactivatePlayer);
                    mixController.isPlaying = '';
                    setTimeout(function() {
                        mixController.sections.player.html('');
                    },500);
                });
				
				this.container.on('click', '.plus', function(){
					var type = $(this).data('type');
					var selectData = $(this).parents('.containerPrograms').find('.item');
					var data = {};
					data.high = (typeof selectData.data('high') !== 'undefined') ? selectData.data('high') : '';
					data.medium = (typeof selectData.data('medium') !== 'undefined') ? selectData.data('medium') : '';
					data.background = (typeof selectData.data('poster') !== 'undefined')? selectData.data('poster'): '';
					data.title = (typeof selectData.data('title') !== 'undefined')? selectData.data('title'):'';
					data.telement = (typeof selectData.data('element') !== 'undefined')? selectData.data('element'):'';				
					window.requestAnimationFrame(mixController._activateShare);
					setTimeout(function(){
						mixController._renderShare(type,data);
					}, 500);					
				});
				
				this.container.on('click', '.share.playing .close', function(){
					window.requestAnimationFrame(mixController._inactivateShare);
                    setTimeout(function() {                        
                        mixController.sections.page.removeClass('hidden');
                        mixController.sections.share.html('');
                    },500);
				});
				
				this.container.on('click', '.favorite', function(){                    
                    ++mixController.aux;
                    var favoriteContent = $(this);
                    mixController.cloneFavoriteSelect = favoriteContent.parents('.containerPrograms');
                    var html = mixController.cloneFavoriteSelect[0].outerHTML;
                    var id = mixController.cloneFavoriteSelect[0].id;
					localStorage.setItem(mixController._key.id=id, mixController._key.html=html);

                    //mixController.dict[mixController.aux] = { hh: mix }
					
                    //var rated = localStorage.setItem('star',favoriteContent.attr('id'));
                      mixController._renderContentFavorites();
                    
                    if(!favoriteContent.hasClass('active')){
                        favoriteContent.addClass('active favoriteActive');
                        mixController._activateFavorite('Añadido a','#23b2eb');
                    } else {
                        favoriteContent.removeClass('active favoriteActive');                        
                        mixController._activateFavorite('Eliminado de','#FFFFFF');
                    }
                    setTimeout(function(){
                        mixController._inactivateFavorite();
                    },3000);
				});
			},
			
			_displayFixed : function(){
				var html = '';
				$(window).scroll(function(){
					var fixed = $(".programsContainer").find('.stageTitle');
					if ($(this).scrollTop() > 50) fixed.addClass("fixed").fadeIn();
					else fixed.removeClass("fixed");
				});
			},
			
			_getProgramsContent : function(request){
				//mixController.sections.programs.addClass('loading').html('<div class="loadingCircles"><div class="circle" id="rotate_01"></div><div class="circle" id="rotate_02"></div><div class="circle" id="rotate_03"></div><div class="circle" id="rotate_04"></div><div class="circle" id="rotate_05"></div><div class="circle" id="rotate_06"></div><div class="circle" id="rotate_07"></div><div class="circle" id="rotate_08"></div>');
				var html = '';
				html += '<section class="navtop topPrograms"><span><img src="img/returnIcon.png" class="returnHomePrograms"/></span></section>';
				if(typeof request.stage !== 'undefined'){
					mixController._displayFixed();
					html += '<div class="stage"><img src="' + request.stage + '"><span class="stageTitle">videos</span></div>';
					setTimeout(function() {
						$.when(mixController._getData(request.callback, request.feed)).done(function (responseData){
							window.requestAnimationFrame(mixController._activateVideoPrograms);	
							html += mixController._renderProgramsContent(responseData);
							//mixController.sections.programs.removeClass('loading').html(html);
							mixController.sections.programs.html(html);
						}).fail(function (error) {
								console.log(error);
						});
					},500);
				}
			},
			
            _renderContentFavorites : function(){
                mixController.sections.content.removeClass('loading');
                
                if(localStorage.length != ''){

                    var contents = localStorage.getItem(mixController._key.id);
						
						for (var a in localStorage){
							val = $(localStorage[a]);
							val.appendTo(mixController.sections.favorites);
						}
                        //contents = $(contents);
						//contents.appendTo(mixController.sections.favorites);

                    //mixController.sections.favorites.html(contents);
                }else{
                //    mixController.sections.favorites.html('<p style="color:#FFF;">Puedes agregar contenido a esta sección utilizando el elemento &#9733; </p>');
                }
            },

			_renderProgramsContent : function(content){
				var html = '';
				var classIcon = '';
				var sectionName = '';
				var poster = '';
				var sectionTitle = '';
				$.each( content, function( key, item ) {
										
					$.each(item.videos, function(idx, value){						
						classIcon = "tvsagal-descripcion";
						sectionName = "Videos Programas";
						sectionTitle = value.title;
						duration = value.duration;
						dataHigh = value.urls[0].apps;
						dataMedium = value.urls[0].medium;
						poster = value.thumb.replace('.136.102.jpg','.300.225.jpg');
						duration = value.duration;
                        //favoriteActive = (localStorage.getItem('star') == '"fav'+idx+'"') ? 'favoriteActive' : '';

						html += '<div class="containerPrograms" id="'+sectionTitle+'-'+idx+'"><div class="reproContainer item" "data-type="detail-programs" data-key="'+idx+'" data-title="' + sectionTitle + '" data-high="' + dataHigh + '" data-medium="' + dataMedium + '" data-poster="' + poster + '"data-pubdate="' + value.publidate + '" data-element="' + value.typeElement + '"><img src="'+ poster +'" /></div><div class="title-program"><p>' + sectionTitle + '</p><div class="socials-icons"><span class="plus" data-type="share">&#43;</span><span class="favorite" id="fav'+ idx +'">&#9733;</span></div></div></div>';
					})
				});
				return html;
			},
			_renderShare : function (type, data){
				var html = '';
				if(type == 'share'){
					mixController.isPlaying = 'share';							
						html += '<span class="close"><i class="tvsa-error"></i></span>';
						html += '<section class="containerDesc">';
						html += '<img src="' + data.background + '"/>';
						html += '<section class="containerSec">';
						html += '<section class="columnLeft">';
						html += '<span>' + data.title + '</span>';
						html += '<span>' + data.telement + '</span>';
						html += '</section>';
						html += '<section class="columnRight">';
						html += '<span class="favorite">&#9733;</span>';
						html += '<span data-type="video" data-section="playerInShare" data-high="' + data.high + '" data-medium="' + data.medium + '" data-poster="' + data.background + '" class="item play"></span>';
						html += '</section>';
						html += '</section>';		
						html += '</section>';						
						html += '<section class="shareOptions">';						
						html += '<span id="shareTwitter"></span>';
						html += '<span id="shareFacebook"></span>';
						html += '<span id="shareByEmail"></span>';
						html += '<p>' + data.title + '</p>';
						html += '</section>';								
				}
				mixController.sections.share.html(html)				
			},
			
			_renderPlayer : function (type, data) {
                var html = '';
                if(type == 'article'){
                    mixController.isPlaying = 'article';
						html += '<div class="containerArticle">';
						html += '<img src="' + data.poster + '" alt="' + data.title + '" />';
						html += '<div class="subContainer"><span>' + data.title + '</span>';
						html += data.content;
						html += '</div></div>';
						html += '<span class="close"><i class="tvsa-error"></i></span>';						
                } else if(type == 'video' || type == 'detail-programs'){
                    mixController.isPlaying = 'video';						
						html += '<video controls poster="'+data.background+'">';
						html += '<source src="'+data.high+'" type="video/mp4">';
						html += '<source src="'+data.medium+'" type="video/mp4">';
						html += 'Your browser does not support HTML 5 video';
						html += '</video>';
						html += '<span class="close"><i class="tvsa-error"></i></span>';
				
                }
                mixController.sections.player.html(html);
            },
            
            _getData : function (callback, url) {
				
				if(typeof this.requests[callback] !== 'undefined'){
                    this.requests[callback].abort();
                }
                
                this.requests[callback] = $.ajax({
                    type : 'GET',
                    url : url,
                    async : true,
                    jsonpCallback : callback,
                    contentType : "application/json",
                    dataType : 'jsonp'
                });
				
                return this.requests[callback];
            },
			
			_generateModel : function (newArr, sectionPage){
				var arrtmp = [];								
	
				if(sectionPage == 'noticias'){
					arrtmp += '<div class="stage noticias"></div>';
				}	
				
				arrtmp += '<section class="columnauno">';
					for (var i = 1; i < (newArr.length + 1); i++) {
						
						if ((i % 2) != 1) {
							if (newArr[i]) {
								arrtmp += newArr[i];
							}
						}
					}
					arrtmp += '</section>';
					arrtmp += '<section class="columnados">';
					for (var j = 1; j < (newArr.length + 1); j++) {						
						if ((j % 2) == 1) {
							if (newArr[j]) {
								arrtmp += newArr[j];
							}
						}
					}
					arrtmp += '</section>';					
				    return arrtmp; 
					
			},
			
            _renderContent : function (content){
                var html = '';
                var classIcon = '';
                var category = '';
                var sectionName = '';
                var poster = '';				
				var newArr = [];					
					$.each( content, function( key, item ) {
										
						if (item.typeElement == "video") {
							classIcon = "tvsagui-video";
							category = item.typeElement;
							sectionName = "Videos";
							poster = item["still"];
							newArr.push('<div class="item" data-type="video" data-high="' + item.urls['medium'] + '" data-medium="' + item.urls['apps'] + '" data-poster="' + poster.replace('.136.102.jpg','.300.225.jpg') + '" data-key="'+key+'"><img src="' + poster.replace('.136.102.jpg','.300.225.jpg') + '" /><figcaption class="title-thumb"><p>'+item['title']+'</p><div class="pjt-desc"><div class="icon_item"><i class="' + classIcon + '"></i></div><div class="icon_desc"><p class="pjt-tipo">' + category + '</p><p class="pjt-subseccion">Secci&oacute;n: <b>' + sectionName + '</b></p></div></div></figcaption></div></div>');
						} else if (item.typeElement == "article") {                            
							classIcon = "tvsagal-descripcion";
							category = item.category;
							sectionName = "Art&iacute;culos";
							poster = item["thumbnail"];							                            
							newArr.push('<div class="item" data-type="article" data-key="'+key+'" data-content="' + item.content + '" data-title="' + item.title + '" data-pubdate="' + item.pubDate + '" data-poster="' + poster.replace('.136.102.jpg','.300.225.jpg') + '"><img src="'+ poster.replace('.136.102.jpg','.300.225.jpg')+'" /><figcaption class="title-thumb"><p>' + mixController._trimLength(item['title'], 40) + '</p><div class="pjt-desc"><div class="icon_item"><i class="' + classIcon + '"></i></div><div class="icon_desc"><p class="pjt-tipo">' + sectionName + '</p><p class="pjt-subseccion">Secci&oacute;n: <b>' + category + '</b></p></div></div></figcaption></div>');
						}						
					});

					return mixController._generateModel(newArr);
					
            },
			
			_renderContentNews : function (content, section){
				var type = '';
                var category = '';
				var classIcon = '';
                var sectionName = '';
                var poster = '';				
				var newArr = [];						
					
					$.each( content, function( key, item ) {							                         						

						dataContent = (item.content) ? 'data-contents="' + item.content + '"' : '';
						dataPubDate = (item.pubDate) ? 'data-pubdate="' + item.pubDate + '"' : '';
						
						if(typeof item.thumb !== 'undefined'){ //VIDEOS
							type = "video";
							classIcon = "tvsagui-video";
							poster = item["thumb"];
							sectionName = "Videos";
							category = item.typeElement;	
							newArr.push('<div class="item" data-type="' + type + '" data-key="'+key+'"' + dataContent + 'data-title="' + item.title + '" data-poster="' + poster.replace('.136.102.jpg','.300.225.jpg') + '"><img src="'+ poster.replace('.136.102.jpg','.300.225.jpg')+'" /><figcaption class="title-thumb"><p>' + mixController._trimLength(item['title'], 40) + '</p><div class="pjt-desc"><div class="icon_item"><i class="' + classIcon + '"></i></div><div class="icon_desc"><p class="pjt-tipo">' + sectionName + '</p><p class="pjt-subseccion">Secci&oacute;n: <b>' + category + '</b></p></div></div></figcaption></div>');
						} else if (typeof item.thumbnail != "undefined"){  //NOTICIAS
							type = "article";
							classIcon = "tvsagal-descripcion";
							poster = item["thumbnail"];
							sectionName = "Noticias";
							category = item.category;
							newArr.push('<div class="item" data-type="' + type + '" data-key="'+key+'"' + dataContent + 'data-title="' + item.title + '" data-poster="' + poster.replace('.136.102.jpg','.300.225.jpg') + '"><img src="'+ poster.replace('.136.102.jpg','.300.225.jpg')+'" /><figcaption class="title-thumb"><p>' + mixController._trimLength(item['title'], 40) + '</p><div class="pjt-desc"><div class="icon_item"><i class="' + classIcon + '"></i></div><div class="icon_desc"><p class="pjt-tipo">' + sectionName + '</p><p class="pjt-subseccion">Secci&oacute;n: <b>' + category + '</b></p></div></div></figcaption></div>');
						} else if( typeof item.id !== 'undefined'){
							newArr.push();
						} else { //PROGRAMAS							
							poster = item.img;
							newArr.push('<div class="programs" data-type="programs" data-key="'+key+'" data-feed=' + item.jsonp + ' data-callback="' + item.callback + '" data-stage="' + item.stage + '" data-title="' + item.Name + '"><img style="width:100%;" src="' + item.img + '" /></div>');
						}
						
					});					
					return mixController._generateModel(newArr, section);
			},
            
            _getDefaultContent : function (feed, callback, stage) {
                var html = '';

                setTimeout(function() {
                    $.when(mixController._getData(callback, feed)).done(function (responseData){
                        var html = '';						

                        if(typeof responseData.items !== 'undefined'){ //HOME
                            html += mixController._renderContent(responseData.items);
                        } else if(typeof responseData[0].items !== 'undefined'){ //NOTICIAS
							html += mixController._renderContentNews(responseData[0].items, 'noticias');
						} else if(typeof responseData[0].videos !== 'undefined'){// VIDEOS
							html += mixController._renderContentNews(responseData[0].videos, 'videos');
						}
						
                        mixController.sections.content.removeClass('loading').html(html);
                    }).fail(function (error) {
                        console.log(error);
                    });
                },500);
            },

            _inactivatePlayer : function () {
				mixController.sections.programs.removeClass('hidden playing');
				mixController.sections.page.removeClass('hidden playing');               
                mixController.sections.player.removeClass('playing');
                setTimeout(function(){
                    mixController.sections.player.addClass('hidden');
                }, 400);
            },

			_activatePlayer: function(){
				mixController.sections.page.addClass('playing');
                mixController.sections.player.removeClass('hidden').addClass('playing');
				mixController.sections.programs.addClass('playing');
                setTimeout(function(){
                    mixController.sections.page.addClass('hidden');
					mixController.sections.programs.addClass('hidden');	
                }, 400);
			},
            
            _activatePlayerInShare : function(){
                mixController.sections.share.removeClass('playing');
                mixController.sections.player.removeClass('hidden').addClass('playing');                                              
                setTimeout(function(){
                    mixController.sections.page.addClass('hidden');
					mixController.sections.programs.addClass('hidden');	
                }, 400);              
            },
			
			_inactivateVideoPrograms : function () {
                mixController.sections.programs.removeClass('active');
            },
			
            _activateVideoPrograms : function () {
                mixController.sections.programs.addClass('active');                
            },
			
			_activateShare : function (){
				mixController.sections.share.removeClass('hidden').addClass('playing');
				mixController.sections.programs.addClass('playing');
				mixController.sections.page.addClass('hidden');
				setTimeout(function () {
					mixController.sections.programs.addClass('hidden');
				}, 400);
			},
			
			_inactivateShare : function (){
				mixController.sections.share.removeClass('playing');
				mixController.sections.programs.removeClass('hidden playing');
				//mixController.sections.programs.removeClass('hidden');
				//mixController.sections.page.removeClass('hidden playing');
				setTimeout(function(){
					mixController.sections.share.addClass('hidden');					
				},400);
			},

            _activateFavorite : function (activate, color){
                var html = '';
                html += '<span style="color:' + color + '">&#9733;</span>';
                html += '<hr class="lineFormat"/>';
                html += '<p>'+ activate +' Favoritos</p>';                
                mixController.sections.favorite.removeClass('hidden').toggleClass("fadeIn").html(html);
                setTimeout(function(){
                    mixController.sections.favorite.removeClass('fadeIn').addClass('zoomOut');
                },2500);
            },

            _inactivateFavorite : function (){
                mixController.sections.favorite.removeClass('zoomOut').addClass('hidden');
            },

			_getMasterFeeds : function(request, getURLVal){
				mixController.sections.content.addClass('loading').html('<div class="loadingCircles"><div class="circle" id="rotate_01"></div><div class="circle" id="rotate_02"></div><div class="circle" id="rotate_03"></div><div class="circle" id="rotate_04"></div><div class="circle" id="rotate_05"></div><div class="circle" id="rotate_06"></div><div class="circle" id="rotate_07"></div><div class="circle" id="rotate_08"></div>');
				var dataFeed = '';
                var callback = '';
				setTimeout(function() {
                    $.when(mixController._getData(request.callback[0], request.feed[0])).done(function (responseData){
						
                        if(typeof responseData[0].home[0].jsonp!=='undefined'){

							switch (getURLVal.val){
								case 'home':
									dataFeed = this.contents['feedMix'] = (responseData[0].home[0].jsonp);
									callback = responseData[0].home[0].callback;
									break;
								case 'home_videos':
									dataFeed = this.contents['feedMixVideo'] = (responseData[0].home[1].jsonp);									
									break;
								case 'videos':
									dataFeed = this.contents['feedsVideos'] = (responseData[0].videos.jsonp);s
									callback = responseData[0].videos.callback;
									break;
								case 'noticias':
									dataFeed = this.contents['feedNoticias'] = (responseData[0].noticias.jsonp);
									callback = responseData[0].noticias.callback;									
									break;
								case 'premios':
									dataFeed = this.contents['feedPremios'] = (responseData[0].premios.jsonp);
									callback = responseData[0].premios.jsonp;
									break;
								case 'programas' :							
									var html  = '';									
									 html += mixController._renderContentNews(responseData[0].programas, 'programas');
									 mixController.sections.content.removeClass('loading').html(html);
									return;
									break;	
								default:									
									dataFeed = this.contents['feedMix'] = (responseData[0].home[0].jsonp);
									callback = responseData[0].home[0].callback;
							}
                        }
                        
						if(getURLVal.val != 'favorites'){
                            mixController._getDefaultContent(dataFeed, callback);
                        }else{                            
                            mixController._renderContentFavorites();                            
                        }
						

                    }).fail(function (error) {
                        console.log(error);
                    });
                },500);
			},
			
			_initSpecialSection : function(){
				
			},
			
            _renderApp : function(feed, callback){
                this._getDefaultContent(feed, callback);
            }

        };
            mixController._init(this);
	}
})(jQuery);
$(function () {
	$('.mix-container').each(function () {
		$(this).renderHome();
	});
});