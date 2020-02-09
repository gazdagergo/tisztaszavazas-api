//import PythonShell from 'python-shell';
import { PythonShell } from 'python-shell';
import scrape from './scrape';

var options = {
  mode: 'json',
  pythonPath: 'python3',
  pythonOptions: ['-u'],
  scriptPath: './pythonScripts/',
};

export default async () => {
  let pyShell = new PythonShell('getUtca.py', options)

  let kozteruletek = [];

  const html = await scrape('https://www.valasztas.hu/szavazokorok_onk2019?p_p_id=onkszavazokorieredmenyek_WAR_nvinvrportlet&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&_onkszavazokorieredmenyek_WAR_nvinvrportlet_tabId=tab2&_onkszavazokorieredmenyek_WAR_nvinvrportlet_telepulesKod=018&_onkszavazokorieredmenyek_WAR_nvinvrportlet_megyeKod=09&_onkszavazokorieredmenyek_WAR_nvinvrportlet_vlId=294&_onkszavazokorieredmenyek_WAR_nvinvrportlet_vltId=687&_onkszavazokorieredmenyek_WAR_nvinvrportlet_szavkorSorszam=14')
  pyShell.send({ html })

  pyShell.on('message', message => {
    kozteruletek.push(message)
  })

  pyShell.end((err,code,signal) => {
    if (err) console.log(err);
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
    console.log(kozteruletek)
  });

}

/* export default () => PythonShell.run('getUtca.py', options, function (err, results) {
  if (err) 
    throw err;
  // Results is an array consisting of messages collected during execution
  console.log(results);
}); */