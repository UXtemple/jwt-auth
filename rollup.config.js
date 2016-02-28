import babel from 'rollup-plugin-babel';

export default {
  dest: 'es5.js',
  entry: 'index.js',
  format: 'umd',
  moduleName: 'jwtAuth',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [
        'es2015-rollup'
      ]
    })
  ]
};
