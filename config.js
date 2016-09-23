const os = 'phone';
// const os = 'mac';

let name = 'listView';
let host = 'localhost:3001';

if(os == 'phone'){
  name = 'Wuba';
  host = '10.252.166.108:3001';
}

export default {
  name,
  host
};
