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

	function topBottomTest( el ) {
		// Some browsers require fixed/absolute to report accurate top/left values.
		var $el = (el instanceof jQuery ? el : $( el ) );
		return $el.css( 'top' ) !== 'auto' || $el.css( 'bottom' ) !== 'auto';
	}

	function getPx( unit ) {
		return parseInt( unit, 10 ) || 0;
	}

	var S = {
		classes: {
			plugin: 'fixedsticky',
			init: 'fixedsticky-init',
			active: 'fixedsticky-on',
			inactive: 'fixedsticky-off',
			opposite: 'fixedsticky-opposite',
			clone: 'fixedsticky-dummy',
			polyFillOptional: 'fixedsticky-native',
			polyFillActive: 'fixedsticky-polyfilled',
			withoutFixedFixed: 'fixedsticky-withoutfixedfixed'
		},
		keys: {
			offset: 'fixedStickyOffset',
			position: 'fixedStickyPosition',
			state: 'fixedStickyState',
			elHeight: 'fixedStickyElHeight',
			viewportHeight: 'fixedStickyViewportHeight',
			parentOffset: 'fixedStickyParentOffset',
			parentHeight: 'fixedStickyParentHeight',
			prescrollTop: 'fixedstickyprescrolltop'
		},
		tests: {
			sticky: featureTest( 'position', 'sticky' ),
			fixed: featureTest( 'position', 'fixed', true )
		},
		reCalc: function( el ) {
			var $el = (el instanceof jQuery ? el : $( el ) ),
				$parent = $el.parent();
			$el.data( S.keys.elHeight, $el.outerHeight(true) );
			$el.data( S.keys.viewportHeight, $( window ).height() );
			$el.data( S.keys.parentOffset, $parent.offset().top );
			$el.data( S.keys.parentHeight, $parent.outerHeight() );
		},
		firstCalc: function( el ) {
			var $el = (el instanceof jQuery ? el : $( el ) ),
				position,
				offset;

			position = {
				top: $el.css( 'top' ) !== 'auto',
				bottom: $el.css( 'bottom' ) !== 'auto'
			};
			$el.data( S.keys.position, position );

			if (position.bottom) {
				offset = getPx( $el.css( 'bottom' ) );
			} else {
				offset = getPx( $el.css( 'top' ) );
			}
			$el.data( S.keys.offset, offset );

            if (!$el.data(S.keys.prescrollTop)) {
                $el.data(S.keys.prescrollTop, 0);
            }

			S.reCalc( el );
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
			var $el = (el instanceof jQuery ? el : $( el ) );
	  
			// if update has been called outside of fixedSticky (eg a seperate event has triggered a reCalc/reUpdate), and this element is not initialised (eg it's being dealt with natively), exit.
			if (!$el.data( S.keys.position )) {
				return;
			}

			S.reCalc( el );

			var $parent = $el.parent(),
				scroll = S.getScrollTop(),
				offset 	=	$el.data( S.keys.offset ),
				position 		=	$el.data( S.keys.position ),
				state 			=	$el.data( S.keys.state ),
				elHeight 		=	$el.data( S.keys.elHeight ),
				viewportHeight 	=	$el.data( S.keys.viewportHeight ),
				parentOffset 	=	$el.data( S.keys.parentOffset ),
				parentHeight 	=	$el.data( S.keys.parentHeight ),
				prescrollTop 		=	$el.data(S.keys.prescrollTop);

			function toggle ( newState ) {
				$el[ newState=='sticky' ? 'addClass' : 'removeClass' ]( S.classes.active )
					[ newState=='initial' ? 'addClass' : 'removeClass' ]( S.classes.inactive )
					[ newState=='opposite' ? 'addClass' : 'removeClass' ]( S.classes.opposite );
				$el.data( S.keys.state, newState );
			};

			function offTheTop() {
				if ( position.bottom ) {
					//return scroll + viewportHeight + offset < parentOffset + ( elHeight || 0 );
					return scroll + viewportHeight  < parentOffset + elHeight + offset;
				} else {
					var offsetTop = scroll + offset - prescrollTop;
					// Initial Offset Top
					return offset + parentOffset >= offsetTop;
				}
			}

			function offTheBottom() {
				if ( position.bottom ) {
					return scroll + viewportHeight > parentOffset + parentHeight ;
				} else {
					var offsetTop = scroll;
					// Initial Offset Top
					return offsetTop + elHeight > parentOffset + parentHeight - offset;
				}
			}

			function unFix() {
				$el.attr('style',false);
			}

			function fixToOpposite() {
				if ( position.bottom ) {
					$el.css({
						'position' : 'absolute',
						'top': 0,
						'bottom' : 'auto'
					});
				} else {
					$el.css({
						'position' : 'absolute',
						'top': 'auto',
						'bottom': 0
					});
				}
			}

			if( offTheTop() ) {
				//console.log('topZone');
				if( state != 'initial' ) {
					toggle( 'initial' );
					if ( position.bottom ) {
						fixToOpposite();
					} else {
						unFix();
					}
				}
			} else if( offTheBottom() ) {
				//console.log('bottomZone');
				if( state != 'opposite' ) {
					toggle( 'opposite' );
					if ( position.top ) {
						fixToOpposite();
					} else {
						unFix();
					}
				}
			} else {
				//console.log('stickyZone');
				if( state != 'sticky' ) {
					toggle( 'sticky' );
					unFix();
				}
			}
		},
		destroy: function( el ) {
			var $el = (el instanceof jQuery ? el : $( el ) );
			if (S.bypass()) {
				return;
			}

			// check if we're about to remove the last sticky element in the document
			if ( ( $( '.' + S.classes.init ).length - $el.length ) <= 0 ) {
				$( win ).unbind( '.fixedsticky' );
				$( win.document.documentElement ).removeClass( S.classes.polyFillActive );
			}

			return $el.each(function() {
				$( this )
					.removeData( [ S.keys.offset, S.keys.position, S.keys.state, S.keys.elHeight, S.keys.viewportHeight, S.keys.parentOffset, S.keys.parentHeight, S.keys.prescrollTop ] )
					.removeClass( S.classes.init )
					.removeClass( S.classes.active )
					.removeClass( S.classes.inactive )
					.removeClass( S.classes.opposite )
					.next( '.' + S.classes.clone ).remove();
			});
		},
		init: function( el ) {
	  
			var $el = $( el );

			if( S.bypass() ) {
				$( win.document.documentElement ).addClass( S.classes.polyFillOptional );
				return;
			}

			if( topBottomTest( el ) ) {
				$( win.document.documentElement ).addClass( S.classes.polyFillActive );
			}

			return $el.each(function() {
				var _this = this;
				$( win ).bind( 'scroll.fixedsticky', function() {
					S.update( _this );
				});

				S.firstCalc( _this );

				$(_this).after( $( '<div>' ).addClass( S.classes.clone ).addClass( $(_this).attr("class").replace('fixedsticky', '') ).height( $(_this).data( S.keys.elHeight ) ) ).addClass( S.classes.init );

				S.update( _this );
				
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