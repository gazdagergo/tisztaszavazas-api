import { PythonShell } from 'python-shell';

var options = {
  mode: 'json',
  pythonPath: 'python3',
  pythonOptions: ['-u'],
  scriptPath: './pythonScripts/',
};

export default (html, pyScript = 'parseSzkHtml.py') => (
  new Promise((resolve, reject) => {
    let pyShell = new PythonShell(pyScript, options)

    let parsedData;

    pyShell.send({ html })

    pyShell.on('message', message => {
      parsedData  = message;
    })

    pyShell.end((err,code,signal) => {
      if (err) reject(err);
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
      resolve(parsedData)
    });
  })
)
