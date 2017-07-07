const path = require('path');
const webpack = require('webpack')
module.exports = {
	entry: {
		'todo-app': './lib/demos/todo-app/todo-app.ngelement.js',
		'now-card-feed': './lib/demos/now-cards/now-card-feed.ngelement.js',
    'now-card': './lib/demos/now-cards/now-card.ngelement.js',
    'progress-bars': './lib/demos/progress-bar/progress-bar.ngelement.js',
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
