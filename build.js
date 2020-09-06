const electronInstaller = require('electron-winstaller');
async function build(){
try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: 'powerplant-win32-x64',
      outputDirectory: '.',
      authors: 'Rahul Seetharaman',
      exe: 'powerplant.exe'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
}
build()