A = [
    { name: "判断题", number: 0, content: {}, type: "judge", scores: 2 },
    {
      name: "填空题",
      number: 0,
      content: {},
      type: "fillEmpty",
      scores: 2,
    },
    { name: "单选题", number: 0, content: {}, type: "choice", scores: 2 },
    { name: "多选题", number: 0, content: {}, type: "manyChoice", scores: 2 },
    { name: "连线题", number: 0, content: {}, type: "ligature", scores: 2 },
    {
      name: "简答题",
      number: 0,
      content: {},
      type: "shortAnswer",
      scores: 2,
    },
    { name: "pad实操题", number: 0, content: {}, type: "scene", scores: 2 },
    { name: "情景题", number: 0, content: {}, type: "business", scores: 2 },
    { name: "听音知人题", number: 0, content: {}, type: "listen", scores: 2 },
    { name: "听打录入题", number: 0, content: {}, type: "hearInput", scores: 2 },
    { name: "电话号码题", number: 0, content: {}, type: "phoneNumber", scores: 2 },
    { name: "号码背记题", number: 0, content: {}, type: "numberMemory", scores: 2 },     
    { name: "听清听辨题", number: 0, content: {}, type: "hearClearly", scores: 2 },]


    B = [
        { name: "判断题", number: 0, content: {}, type: "judge", scores: 2 },
        {
          name: "填空题",
          number: 0,
          content: {},
          type: "fillEmpty",
          scores: 2,
        },
        { name: "单选题", number: 0, content: {}, type: "choice", scores: 2 },
        { name: "多选题", number: 0, content: {}, type: "manyChoice", scores: 2 },
        { name: "连线题", number: 0, content: {}, type: "ligature", scores: 2 },
        {
          name: "简答题",
          number: 0,
          content: {},
          type: "shortAnswer",
          scores: 2,
        },
        { name: "pad实操题", number: 0, content: {}, type: "scene", scores: 2 },
        { name: "情景题", number: 0, content: {}, type: "business", scores: 2 },
        { name: "听音知人题", number: 0, content: {}, type: "listen", scores: 2 },
        { name: "听打录入题", number: 0, content: {}, type: "hearInput", scores: 2 },
        { name: "电话号码题", number: 0, content: {}, type: "phoneNumber", scores: 2 },
        { name: "号码背记题", number: 0, content: {}, type: "numberMemory", scores: 2 },     
        { name: "听清听辨题", number: 0, content: {}, type: "hearClearly", scores: 2 },]
let s='tree';
let obj={};
for(let i of s){
  if(obj[i]){
    obj[i]++;
  }else{
    obj[i]=1;
  }
}
let t=Object.keys(obj).sort((a,b)=>obj[b]-obj[a]);
let w=Object.values(obj).sort((a,b)=>a-b);
console.log('obj',t,'w',w)

let arr=[1,2,3,4,5,6,7,8,9,10];
console.log('a-b',arr.sort((a,b)=>a-b))
console.log('b-a',arr.sort((a,b)=>b-a))

let prices=[7,1,5,3,6,4]
let n=prices.length;
    // let dp[n][2];
    let dp=new Array(n).fill(0).map(v=>new Array(2).fill(0));
    dp[0][0]=0;
    dp[0][1]=-prices[0];
    for(let i=1;i<n;i++){
        dp[i][0]=Math.max(dp[i-1][0],dp[i-1][1]+prices[i]);
        dp[i][1]=Math.max(dp[i-1][1],dp[i-1][0]-prices[i])
    }
    console.log(dp)

    let abc=new Array(4).fill(0).map(v=>new Array(2).fill(0))
    console.log(abc)


    let obja=[
      {
        id: 1, name: 'bob', age: 13
      },
      {
        id: 2, name: 'lls', age: 16
      },
      {
        id: 3, name: 'als', age: 19
      },
      {
        id: 4, name: 'hhd', age: 18
      }
  ]
  console.log('id',obja.map(item=>item.id))
  console.log('name',obja.map(item=>item.name))
  console.log('age',obja.map(item=>item.age))