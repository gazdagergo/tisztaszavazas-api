import { PythonShell } from 'python-shell';

var options = {
  mode: 'text',
  pythonPath: 'python3',
  pythonOptions: ['-u'],
  scriptPath: './pythonScripts/',
};

export default html => (
  new Promise((resolve, reject) => {
    let pyShell = new PythonShell('parseSzkHtml.py', options)

    let szkParsedData;
    pyShell.send('html')
    console.log('sent')

    pyShell.on('message', message => {
      console.log({message})
      szkParsedData  = message;
    })

    pyShell.end((err,code,signal) => {
      if (err) reject(err);
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
      resolve(szkParsedData)
    });
  })
)
