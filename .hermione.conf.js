module.exports = {
  sets: {
    desktop: {
      files: "test/hermione",
    },
  },

  browsers: {
    chrome: {
      automationProtocol: "devtools",
      desiredCapabilities: {
        browserName: "chrome",
      },
      retry: 5,
      windowSize: {
        width: 1920,
        height: 1080,
      },
      screenshotDelay: 1000
    },
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
    },
  },
};
