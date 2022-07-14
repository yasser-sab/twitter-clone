const form = document.querySelector('.form');
const loading = document.querySelector('.loading');
const twitts = document.querySelector('.twitts');
const API_URL = window.location.hostname=='127.0.0.1'?'http://localhost:5000/twitt':'https://twitter-clone-api2.vercel.app/twitt';


function getTwitts(){
    twitts.innerHTML='';
    fetch(API_URL)
    .then(response=>response.json())
    .then(result=>{
        result.map(twitt=>{
            const div=document.createElement('div');
            const header = document.createElement('h3');
            header.textContent=twitt.name;
            const message=document.createElement('p');
            message.textContent=twitt.message;
            const date = document.createElement('date');
            date.textContent=twitt.created;

            div.appendChild(header);
            div.appendChild(message);
            div.appendChild(date);
            twitts.appendChild(div);
        });
    });
}

getTwitts();

form.addEventListener('submit',function(e){
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const message = formData.get('message');

    const twitt = {
        name : name,
        message:message
    };

    loading.classList.add('active');
    form.classList.remove('active');

    fetch(API_URL,{
        method:"POST",
        body:JSON.stringify(twitt),
        headers:{
            'content-type':'application/json'
        }
    }).then(response=>{
        if(response.ok){
            return response.json();
        }
        throw new Error('error');
    })
    .then(inserted => {

        form.reset();
        setTimeout(()=>{
            loading.classList.remove('active');
            form.classList.add('active');
            getTwitts();
        },1000);
    })
    .catch(error=>{
        setTimeout(()=>{
            loading.classList.remove('active');
            form.classList.add('active');

        },1000);
    });

});