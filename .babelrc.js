module.exports = {
    presets: [
      ['@babel/env', {
        targets: {
          node: 'current'
        },
        useBuiltIns: 'usage',
      }],
    ],
    plugins: [
      ['module-resolver',{
        root: ['./src']
      }],
    ],
}
