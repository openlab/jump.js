		
	String.prototype.format = function() { a = this; for ( k in arguments ) { a = a.replace('{' + k + '}', arguments[k]); } return a; };
	window.demo = { 
		'version': '1.0', 
		'mapOptions': { 'credentials': 'Arkh4--7e-cy1ek_QH9oq3qerZut_jOPrR8h8C0Z69RKgE8aUuBe0inLrDWZvacw', 'enableSearchLogo': false, 'showBreadcrumb': true, 'enableClickableLogo': false, 'showScalebar': false, disableStreetside: false },
		'ga': 'UA-17614686-7',
		'url': 'http://jquery-bing-maps.googlecode.com/', 
		'forum': 'http://groups.google.com/group/jquery-bing-maps/feed/rss_v2_0_msgs.xml', 
		'subscribe': 'http://groups.google.com/group/jquery-bing-maps/boxsubscribe', 
		'exception': 'Unable to load due to either poor internet connection or some CDN\'s aren\'t as responsive as we would like them to be. Try refreshing the page :D.', 
		'col': [], 
		'tests': [],
		'assert': function(a, b) { if ( window[a] ) { b(); } },
		'add': function(a, b) { if (b) { this.col[a] = b; } else { this.col.push(a); } return this; },
		'load': function(a) { var self = this; if (a) { self.col[a](); } else { $.each(self.col, function(i,d) { /*try {*/ d(); /*} catch (err) { alert(self.exception); }*/ }); } },
		'timeStart': function(key, desc) { this.tests[key] = { 'start': new Date().getTime(), 'desc': desc }; },
		'timeEnd': function(key) { this.tests[key].elapsed = new Date().getTime(); },
		'report': function(id) { var i = 1; for ( var k in this.tests ) { var t = this.tests[k]; $(id).append('<div class="benchmark rounded"><div class="benchmark-result lt">' + (t.elapsed - t.start) + ' ms</div><div class="lt"><p class="benchmark-iteration">Benchmark case ' + i + '</p><p class="benchmark-title">' + t.desc + '</p></div></div>'); i++; }; },
		'init': function() {
			if ( location.href.indexOf(this.url) > -1 ) {
				var _gaq = _gaq || [];
				_gaq.push(['_setAccount', this.ga]);
				_gaq.push(['_trackPageview']);
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			}
			this.assert('Backbone', function() {
				$('#forum').append('<h2>Forum</h2><ul id="forum_posts"></ul><h2>Subscribe</h2><form id="forum_subscribe" class="subscribe" action="#"><label for="email">E-mail:</label><input id="email" type="text" name="email" /><input type="submit" name="sub" value="Subscribe" /></form>');
				ForumCollection = Backbone.Collection.extend({ 'url': 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q={0}'.format(encodeURIComponent(demo.forum)), 'parse': function(response) { return response.responseData.feed.entries; } });
				ForumPost = Backbone.View.extend({ 'tagName': 'li', 'className': 'group-item', 'template': _.template('<a href="<%=link%>"><%=title%></a></h3>'), 'render': function() { $(this.el).html(this.template(this.model.toJSON())); return this; } }); 
				Forum = Backbone.View.extend({ 'el': $("#forum"), 'initialize': function() { this.col = new ForumCollection(); this.col.bind('reset', this.load, this); this.col.fetch(); }, 'add': function(post) { var view = new ForumPost({'model': post}); $('#forum_posts').append(view.render().el); }, 'load': function () { this.col.each(this.add); $('#forum_subscribe').attr('action', demo.subscribe); $(this.el).show(); } });
				var app = new Forum();
			});
			this.assert('prettyPrint', function() { prettyPrint(); });
			$('#version').text(this.version);
		}
	};
	
	//(function() {
		demo.init();
	//})();