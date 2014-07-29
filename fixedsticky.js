;(function( win, $ ) {

	function featureTest( property, value, noPrefixes ) {
		// Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
		var prop = property + ':',
			el = document.createElement( 'test' ),
			mStyle = el.style;

		if( !noPrefixes ) {
			mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ) + value + ';';
		} else {
			mStyle.cssText = prop + value;
		}
		return mStyle[ property ].indexOf( value ) !== -1;
	}

	function getPx( unit ) {
		return parseInt( unit, 10 ) || 0;
	}

	var S = {
		classes: {
			plugin: 'fixedsticky',
			active: 'fixedsticky-on',
			inactive: 'fixedsticky-off',
			container: 'fixedsticky-container',
			transitionTop: 'fixedsticky-off-transition-top',
			transitionBottom: 'fixedsticky-off-transition-bottom',
			clone: 'fixedsticky-dummy',
			withoutFixedFixed: 'fixedsticky-withoutfixedfixed'
		},
		keys: {
			offset: 'fixedStickyOffset',
			position: 'fixedStickyPosition',
			top: 'fixedStickyTopWhileOn'
		},
		tests: {
			sticky: featureTest( 'position', 'sticky' ),
			fixed: featureTest( 'position', 'fixed', true )
		},
		// Thanks jQuery!
		getScrollTop: function() {
			var prop = 'pageYOffset',
				method = 'scrollTop';
			return win ? (prop in win) ? win[ prop ] :
				win.document.documentElement[ method ] :
				win.document.body[ method ];
		},
		bypass: function() {
			// Check native sticky, check fixed and if fixed-fixed is also included on the page and is supported
			return ( S.tests.sticky && !S.optOut ) ||
				!S.tests.fixed ||
				win.FixedFixed && !$( win.document.documentElement ).hasClass( 'fixed-supported' );
		},
		update: function( el ) {
			if( !el.offsetWidth ) { return; }

			var $el = $( el ),
				height = $el.outerHeight(),
				initialOffset = $el.data( S.keys.offset ),
				scroll = S.getScrollTop(),
				isAlreadyOn = $el.is( '.' + S.classes.active ),
				toggle = function( turnOn ) {
					$el[ turnOn ? 'addClass' : 'removeClass' ]( S.classes.active )
						[ !turnOn ? 'addClass' : 'removeClass' ]( S.classes.inactive );
				},
				viewportHeight = $( window ).height(),
				position = $el.data( S.keys.position ),
				skipSettingToFixed,
				elTop,
				elBottom,
				$parent = $el.parent(),
				parentOffset = $parent.offset().top,
				parentHeight = $parent.outerHeight();

			if( initialOffset === undefined ) {
				initialOffset = $el.offset().top;
				$el.data( S.keys.offset, initialOffset );
				$el.after( $( '<div>' ).addClass( S.classes.clone ).height( height ) );
			}

			if( !position ) {
				// Some browsers require fixed/absolute to report accurate top/left values.
				skipSettingToFixed = $el.css( 'top' ) !== 'auto' || $el.css( 'bottom' ) !== 'auto';

				if( !skipSettingToFixed ) {
					$el.css( 'position', 'fixed' );
				}

				position = {
					top: $el.css( 'top' ) !== 'auto',
					bottom: $el.css( 'bottom' ) !== 'auto'
				};

				if( !skipSettingToFixed ) {
					$el.css( 'position', '' );
				}

				$el.data( S.keys.position, position );
			}

			function isFixedToTopOfViewport( ignoreHeight ) {
				var offsetTop = scroll + ( elTop || $el.data( S.keys.top ) || 0 );

				// Initial Offset Top
				return initialOffset < offsetTop &&
					// Container Bottom
					offsetTop + ( ignoreHeight ? 0 : height ) <= parentOffset + parentHeight;
			}

			function isFixedToBottomOfViewport( ignoreHeight ) {
				// Initial Offset Top + Height
				return initialOffset + ( !height || ignoreHeight ? 0 : height ) > scroll + viewportHeight - elBottom &&
					// Container Top
					scroll + viewportHeight - elBottom >= parentOffset + ( !height || ignoreHeight ? 0 : height );
			}

			function isTransitionOnBottom() {
				return isFixedToTopOfViewport( true );
			}

			function isTransitionOnTop() {
				return isFixedToBottomOfViewport( true );
			}

			function addTransition() {
				if( isTransitionOnBottom() ) {
					$el.parent().addClass( S.classes.container );
					$el.addClass( S.classes.transitionBottom );
				} else if( isTransitionOnTop() ) {
					$el.parent().addClass( S.classes.container );
					$el.addClass( S.classes.transitionTop );
				}
			}

			function removeTransition() {
				$el.parent().removeClass( S.classes.container );
				$el.removeClass( S.classes.transitionTop + ' ' + S.classes.transitionBottom );
			}

			elTop = getPx( $el.css( 'top' ) );
			elBottom = getPx( $el.css( 'bottom' ) );
			if( position.top && isFixedToTopOfViewport() || position.bottom && isFixedToBottomOfViewport() ) {
				if( !isAlreadyOn ) {
					if( !$el.data( S.keys.top ) ) {
						$el.data( S.keys.top, elTop );
					}
					toggle( true );
					removeTransition();
				}
			} else {
				if( isAlreadyOn ) {
					addTransition();

					toggle( false );
				}
			}
		},
		destroy: function( el ) {
			var $el = $( el );
			if (S.bypass()) {
				return;
			}

			$( win ).unbind( '.fixedsticky' );

			return $el.each(function() {
				var $t = $( this );
				$t.removeData( [ S.keys.offset, S.keys.position, S.keys.top ] )
					.removeClass( S.classes.active )
					.removeClass( S.classes.inactive )
					.removeClass( S.classes.transitionTop )
					.removeClass( S.classes.transitionBottom )
					.next( '.' + S.classes.clone ).remove();

				$t.parent().removeClass( S.classes.container );
			});
		},
		init: function( el ) {
			var $el = $( el );

			if( S.bypass() ) {
				return;
			}

			return $el.each(function() {
				var _this = this;
				$( win ).bind( 'scroll.fixedsticky', function() {
					S.update( _this );
				});

				S.update( this );

				$( win ).bind( 'resize.fixedsticky', function() {
					if( $el.is( '.' + S.classes.active ) ) {
						S.update( _this );
					}
				});
			});
		}
	};

	win.FixedSticky = S;

	// Plugin
	$.fn.fixedsticky = function( method ) {
		if ( typeof S[ method ] === 'function') {
			return S[ method ].call( S, this);
		} else if ( typeof method === 'object' || ! method ) {
			return S.init.call( S, this );
		} else {
			throw new Error( 'Method `' +  method + '` does not exist on jQuery.fixedsticky' );
		}
	};

	// Add fallback when fixed-fixed is not available.
	if( !win.FixedFixed ) {
		$( win.document.documentElement ).addClass( S.classes.withoutFixedFixed );
	}

})( this, jQuery );