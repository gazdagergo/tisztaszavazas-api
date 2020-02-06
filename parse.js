//import PythonShell from 'python-shell';
import { PythonShell } from 'python-shell';

var options = {
  mode: 'json',
  pythonPath: 'python3',
  pythonOptions: ['-u'],
  scriptPath: './pythonScripts/',
  args: ['./htmls/M01_T002_S021.html', './tsv/utca.tsv']
};

export default () => {
let pyShell = new PythonShell('getUtca.py', options)

pyShell.on('message', message => {
  console.log(message)
  console.log('.....')
})

pyShell.send({ filename: "./htmls/M01_T002_S021.html" })
}

/* export default () => PythonShell.run('getUtca.py', options, function (err, results) {
  if (err) 
    throw err;
  // Results is an array consisting of messages collected during execution
  console.log(results);
}); */