$("#signUp").on("click",async function(e) {
  e.preventDefault();
  let response = await axios.post("http://localhost:8000/register",{
      fullname: $("#fullname").val(),
      email: $("#email").val(),
      password: $("#password").val()
    });
  if(response.status!=200){
        alert(response.data)
    }else{
        window.open("http://localhost:8000/login", '_parent');
    }
})
