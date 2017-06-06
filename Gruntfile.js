/*global module:false*/
module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		// Constants
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		' Licensed <%= pkg.license %> */\n',
		name: 'fixedsticky',

		// Task Configuration
		clean: {
			files: ['dist/*']
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: 'config/gruntfile.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'config/plugin.jshintrc'
				},
				src: '<%= name %>.js'
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/**/*.js']
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= name %>.js',
				dest: 'dist/<%= name %>.min.js'
			}
		},
		copy: {
			jquery: {
				src: 'node_modules/jquery/dist/jquery.js',
				dest: 'dist/libs/jquery.js'
			},
			qunit: {
				files: [{
					expand: true,
					flatten: true,
					src: [ 'node_modules/qunitjs/qunit/*' ],
					dest: 'dist/libs/',
					filter: 'isFile'
				}]
			}
		},
		watch: {
			files: ['<%= name %>.css', '<%= name %>.js', 'test/fixed-sticky-tests.js'],
			tasks: 'qunit'
		},
		qunit: {
			all: ['test/**/*.html']
		},
		'gh-pages': {
			options: {},
			src: ['<%= name %>.css', '<%= name %>.js', 'test/**/*', 'demos/**/*']
		}
	});

	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	grunt.registerTask( 'default', [ 'copy', 'jshint', 'qunit', 'uglify' ] );
};
