import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
export default {
  input: 'src/module.ts',
  output: {
    file: 'dist/module.js',
    format: 'system',
    sourcemap: true,
  },
  external: [
    'react',
    'react-dom',
    '@grafana/data',
    '@grafana/runtime',
    '@grafana/ui',
  ],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    resolve({ browser: true }),
    commonjs(),
  ],
};
