$("#login").on("click",async function(e) {
  e.preventDefault();

  let response = await axios.post("http://localhost:8000/login",{
      email: $("#email").val(),
      password: $("#password").val(),
    })
    if(response.status!=200){
        console.log(response);
        
        alert(response.data)
    }else{
        window.open("http://localhost:8000/","_parent")
    }
})
