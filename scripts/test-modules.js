// Mock minimal browser globals for testing imports
global.window = {
  notibot: null,
  addEventListener: () => {},
  scrollTo: () => {},
};
global.document = {
  getElementById: (id) => ({ innerHTML: '', style: {}, querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {} }),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  documentElement: { style: { setProperty: () => {} } },
  createElement: () => ({ innerHTML: '', content: { firstChild: null } }),
};
global.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

async function test() {
  try {
    const app = await import('../public/js/app.js');
    console.log('✅ app.js and all submodules imported successfully!');
    if (typeof app.render === 'function') {
      app.render();
      console.log('✅ render() executed without exceptions!');
    }
  } catch (err) {
    console.error('❌ Error executing app.js:', err);
    process.exit(1);
  }
}

test();
