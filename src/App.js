 



import { useEffect, useState } from "react";
import './App.css';



function getNetAccountInfo(){ 
  return new Promise(async (resolve,reject)=>{ 
    const account = await window.ethereum.request({ method: 'eth_accounts' })  
    const network = await window.ethereum.networkVersion
    const address = await window.ethereum.selectedAddress 
    resolve({ account:account[0]||'钱包未安装或授权失败', network, address }) 
  }) 
}

 
 
export default  function TestPage() {
  const [account,setAccount] = useState({}) 
  const [sendInfo,setSendInfo] = useState({})
 
  useEffect(async ()=>{  
    const info = await getNetAccountInfo()  
    
    setAccount(info)
    
    setSendInfo({
      "gas": "0x5208", // gas limit
      "gasPrice": "0x5208", // gas 价格
    })
  },[])

 
  const paySend = ( ) => { 
    sendInfo.from = account.account
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [sendInfo], 
    }).then(function (result) {
      console.log(result)
      // The result varies by method, per the JSON RPC API.
      // For example, this method will return a transaction hash on success.
    }).catch(function (reason) {
      console.log(reason)
     // Like a typical promise, returns a reason on rejection.
    })
  }

  const connect = async ()=>{ 
    try {
      const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) 
      setAccount({
        ...account,
        account: newAccounts[0]
      })
    } catch (error) {
      console.error(error)
    }
  } 
 
  const onChangeMoney = (e)=>{
    if(e.target.value){
      sendInfo.value = '0x' + Number(e.target.value).toString(16) 
    }else{
      sendInfo.value = null
    }
  }
  const onChangeAccount =(e)=>{ 
    if(e.target.value){
      sendInfo.to = e.target.value 
    }else{
      sendInfo.to = null
    } 
  }
 
  return (
    <div className="ethereum-page">  
      <div className='content'> 
        <div className='item'> 
          <div className='label'>当前账户: </div> 
          <div className="value">{account.account}</div>  
          <button className="btn" onClick={connect}>connect</button>
        </div>

        <div className='item'>
          <div className='label'>转账账户: </div> 
          <input className="value" placeholder="请输入转账账户" onInput={onChangeAccount} /> 
        </div>

        <div className='item'>
          <div className='label'>转账金额: </div> 
          <input className="value" pattern="\d*" placeholder="请输入转账金额" onInput={onChangeMoney} />
        </div>

        <div className='item'>
          <button className="send" onClick={paySend}>提交</button>
        </div>

      </div> 
    </div>
  );
}
 
