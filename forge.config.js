module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makeTargets: {
    win32: [
      {
        name: 'ragnarocklayerApp',
        config: {
          target: 'nsis',
         // icon: 'path/to/your/icon.ico',
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
        }
      }
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
