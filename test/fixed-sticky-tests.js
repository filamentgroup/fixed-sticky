(function($) {

	/*
		======== A Handy Little QUnit Reference ========
		http://docs.jquery.com/QUnit

		Test methods:
			expect(numAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			raises(block, [expected], [message])
	*/

	FixedSticky.tests.sticky = false;

	QUnit.module('testDefault', {
		setup: function() {
			$(window).scrollTop( 0 );
		}
	});

	QUnit.test( 'Environment', function( assert ) {
		// These tests require non-native sticky support. Should be set above.
		assert.ok( !FixedSticky.tests.sticky );
	});

	QUnit.test( 'Standard Top', function( assert ) {
		$( '#qunit-fixture' ).html(
				['<style>#sticky { top: 0; }</style>',
				'<div id="sticky" class="fixedsticky">Sticky</div>',
				'<div style="height: 2000px">Test</div>'].join( '' ) );

		var $sticky = $( '#sticky' );
		$sticky.fixedsticky();

		assert.ok( $sticky.hasClass( 'fixedsticky' ) );
		$(window).scrollTop( 1000 ).trigger( 'scroll' );
		assert.equal( $sticky.css( 'position' ), 'fixed' );
		assert.equal( $sticky.offset().top, 1000 );
	});

	QUnit.test( 'Standard Bottom', function( assert ) {
		$( '#qunit-fixture' ).html(
				['<style>#sticky { bottom: 0; }</style>',
				'<div style="height: 2000px">Test</div>',
				'<div id="sticky" class="fixedsticky">Sticky</div>'].join( '' ) );

		var $sticky = $( '#sticky' );
		$sticky.fixedsticky();

		assert.ok( $sticky.hasClass( 'fixedsticky' ) );
		$(window).scrollTop( 1000 ).trigger( 'scroll' );
		assert.equal( $sticky.css( 'position' ), 'fixed' );
		assert.equal( Math.round( $sticky.offset().top ), 1000 + $( window ).height() - $sticky.height() );
	});

	QUnit.test( 'Top constrainted to parent bottom', function( assert ) {
		$( '#qunit-fixture' ).html(
				['<style>#sticky { top: 0; }</style>',
				'<div style="height: 1000px"><div id="sticky" class="fixedsticky">Sticky</div></div>',
				'<div style="height: 2000px">Test</div>'].join( '' ) );

		var $sticky = $( '#sticky' );
		$sticky.fixedsticky();

		assert.ok( $sticky.hasClass( 'fixedsticky' ) );
		$(window).scrollTop( 1000 ).trigger( 'scroll' );
		assert.equal( $sticky.css( 'position' ), 'fixed' );
		assert.equal( $sticky.offset().top, 1000 );
		$(window).scrollTop( 2000 ).trigger( 'scroll' );
		assert.equal( $sticky.css( 'position' ), 'static' );
	});

	QUnit.test( 'Bottom constrainted to parent top', function( assert ) {
		$( '#qunit-fixture' ).html(
				['<style>#sticky { bottom: 0; }</style>',
				'<div style="height: 2000px">Test</div>',
				'<div><div style="height: 2000px"></div><div id="sticky" class="fixedsticky">Sticky</div></div>'].join( '' ) );

		var $sticky = $( '#sticky' );
		$sticky.fixedsticky();

		assert.ok( $sticky.hasClass( 'fixedsticky' ) );

		$(window).scrollTop( 3000 ).trigger( 'scroll' );
		assert.equal( $sticky.css( 'position' ), 'fixed' );
		assert.equal( Math.round( $sticky.offset().top ), 3000 + $( window ).height() - $sticky.height() );

		$(window).scrollTop( 1000 ).trigger( 'scroll' );
		assert.equal( $sticky.css( 'position' ), 'static' );
	});


	QUnit.test( 'Cleanup', function( assert ) {
		$( '#qunit-fixture' ).html( '<div id="sticky" class="fixedsticky">Sticky</div>' );

		var $sticky = $( '#sticky' );
			$sticky.fixedsticky();

		assert.ok( $sticky.next().hasClass( FixedSticky.classes.clone ) );

		$sticky.fixedsticky( 'destroy' );
		assert.ok( !$sticky.siblings( '.' + FixedSticky.classes.clone ).length );
	});

	QUnit.test( 'Destroying one fixedsticky should not cleanup others', function( assert ) {
		$( '#qunit-fixture' ).html(
				['<style>#sticky { top: 0; } #sticky2 { top: 0; }</style>',
				'<div id="sticky" class="fixedsticky">Sticky</div>',
				'<div id="sticky2" class="fixedsticky">Sticky</div>',
				'<div style="height: 2000px">Test</div>'].join( '' ) );

		var $sticky = $( '#sticky' );
		$sticky.fixedsticky();

		var $sticky2 = $( '#sticky2' );
		$sticky2.fixedsticky();

		$sticky.fixedsticky( 'destroy' );

		assert.ok( $sticky2.hasClass( 'fixedsticky' ) );
		$(window).scrollTop( 1000 ).trigger( 'scroll' );
		assert.equal( $sticky2.css( 'position' ), 'fixed' );
		assert.equal( $sticky2.offset().top, 1000 );
	});

}( jQuery ));