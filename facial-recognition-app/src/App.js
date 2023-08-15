
import { useState } from 'react';
import './App.css';

const uuid=require('uuid');

function App() {
  const [image,setImage]=useState('');
  const [uploadResultMessage,setUploadResultMessage]=useState('Please upload image to authenticate');
  const [visitorName,setVisitorName]=useState('placeholder.jpeg');
  const [isAuth, setAuth] =useState(false);
  
  function sendImage(e){
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://ru17duznt3.execute-api.us-east-1.amazonaws.com/dev/aws-visitor-image-storage/${visitorImageName}.jpeg`,{
      method: 'PUT',
      headers: {
        'Content-Type':'image/jpeg'
      },
    body: image
    }).then(async()=>{
      const response= await authenticate(visitorImageName);
      console.log(response);
      if(response.Message ==='Success'){
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to work. Hope you have a productive day`);
      }
      else{
        setAuth(false);
        setUploadResultMessage(' authentication failed: this person is no employeed')
      }
    }).catch(error=>{
      setAuth(false);
      setUploadResultMessage('There is an error during the authentication process');
      console.error(error);
    })
  }

  async function authenticate(visitorImageName){
    console.log('before request url')
    const requestUrl='https://ru17duznt3.execute-api.us-east-1.amazonaws.com/dev/employee?' +new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    console.log(requestUrl)
    console.log('after request url')
    return await fetch(requestUrl,{
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data)=>{
      return data;
    }).catch(error=>console.log("here"));

  }

  return (
    <div className="App">
      <h2>Facial Recognition system</h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e =>setImage(e.target.files[0])}/>
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth?'success':'failure'}>
        {uploadResultMessage}
      </div>
      <img src={require(`./visitors/${visitorName}`)} alt='Visitor' height={250} width={250}/>
    </div>
  );
}

export default App;
