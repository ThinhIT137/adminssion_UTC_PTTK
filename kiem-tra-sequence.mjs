// Chỉ chạy kiểm tra artifact Archify, không chạy kiểm thử nghiệp vụ app.
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const base='docs/squence';
const manifest=JSON.parse(fs.readFileSync(`${base}/manifest.json`,'utf8'));
const cli='C:/Users/Admin/.codex/skills/archify/bin/archify.mjs';
const previous=fs.existsSync(`${base}/ket-qua-archify.json`)?JSON.parse(fs.readFileSync(`${base}/ket-qua-archify.json`,'utf8')):[];
fs.writeFileSync(`${base}/ket-qua-archify-luot-truoc.json`,JSON.stringify(previous,null,2)+'\n');
const hashFile=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const results=previous.filter(r=>r.exitCode===0&&manifest.diagrams.some(d=>d.output===r.output&&r.receipt?.specification?.sha256===hashFile(d.candidate)));
let cursor=1;
async function worker(){
 while(cursor<=6){
  const sprint=cursor++;
  for(const item of manifest.diagrams.filter(d=>d.sprint===sprint)){
  if(results.some(r=>r.title===item.title&&r.sprint===item.sprint&&r.exitCode===0))continue;
  // Dành một thư mục receipt riêng cho từng candidate và lượt kiểm tra.
  const stem=item.candidate.slice(0,-'.sequence.json'.length);
  const args=[cli,'finalize','sequence',item.candidate,item.output,'--repo-root',item.repoRoot,'--quality','showcase','--json','--out-dir',`${stem}.checks-3`];
  const result=await new Promise(resolve=>{
   const child=spawn(process.execPath,args,{windowsHide:true});let out='',err='';
   child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
   child.on('error',e=>resolve({exitCode:-1,error:e.message}));
   child.on('close',code=>{let receipt;try{receipt=JSON.parse(out.trim())}catch{}resolve({exitCode:code,receipt,...(!receipt?{out,error:err}:{})});});
  });
  results.push({title:item.title,sprint:item.sprint,output:item.output,...result});
  fs.writeFileSync(`${base}/ket-qua-archify.json`,JSON.stringify(results,null,2)+'\n');
  console.log(`${result.exitCode===0?'PASS':'FAIL'} | Sprint ${item.sprint} | ${item.title}`);
  }
 }
}
await Promise.all(Array.from({length:3},worker));
console.log(JSON.stringify({total:results.length,pass:results.filter(r=>r.exitCode===0).length,failed:results.filter(r=>r.exitCode!==0).map(r=>r.title)}));
process.exitCode=results.some(r=>r.exitCode!==0)?1:0;
