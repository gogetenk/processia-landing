import { merge } from 'webpack-merge';
import path from 'path';
import baseConfig from './webpack.config.js';

export default merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    writeToDisk: true
  }
});
