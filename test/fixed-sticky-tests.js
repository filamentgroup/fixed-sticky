/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false, start:false, stop:false, ok:false, equal:false, notEqual:false, deepEqual:false, notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false, SocialCount:true */
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

	module('testDefault');

	test( 'Setup', function() {
		// These tests require non-native sticky support. Should be set in the test runner.
		ok( !FixedSticky.tests.sticky );
	});

	test( 'Standard Top', function() {
		$('#qunit-fixture').html(
				['<style>#sticky { top: 0; }</style>',
				'<div id="sticky" class="fixedsticky">Sticky</div>',
				'<div style="width: 100%; height: 2000px">Test</div>'].join( '' ) );

		var $sticky = $( '#sticky' );
		$sticky.fixedsticky();

		ok( $sticky.hasClass( 'fixedsticky' ) );
		$(window).scrollTop( 1000 ).trigger( 'scroll' );
		equal( $sticky.css( 'position' ), 'fixed' );
		equal( $sticky.offset().top, 1000 );
	});

	test( 'Standard Bottom', function() {
		$('#qunit-fixture').html(
				['<style>#sticky { bottom: 0; }</style>',
				'<div style="width: 100%; height: 2000px">Test</div>',
				'<div id="sticky" class="fixedsticky">Sticky</div>'].join( '' ) );

		var $sticky = $( '#sticky' );
		$sticky.fixedsticky();

		ok( $sticky.hasClass( 'fixedsticky' ) );
		$(window).scrollTop( 1000 ).trigger( 'scroll' );
		equal( $sticky.css( 'position' ), 'fixed' );
		equal( $sticky.offset().top, 1000 + $( window ).height() - $sticky.height() );
	});

	test( 'Cleanup', function() {
		$('#qunit-fixture').html('<div id="sticky" class="fixedsticky">Sticky</div>' );

		var $sticky = $( '#sticky' );
			$sticky.fixedsticky();

		ok( $sticky.next().hasClass( FixedSticky.classes.clone ) );

		$sticky.fixedsticky( 'destroy' );
		ok( !$sticky.siblings( '.' + FixedSticky.classes.clone ).length );
	});

}( jQuery ));
