const path = require('path');
const webpack = require('webpack')
module.exports = {
	entry: {
		'todo-app': './lib/demos/todo-app/todo-app-element.js',
		'angular': ['@angular/core', './lib/custom_element_adapter.js']
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: '[name].js'
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({name:"angular", filename:"angular.js"})
	]
}
