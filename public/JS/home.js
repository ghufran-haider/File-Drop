function uplFile(event) {
    event.preventDefault();
    let file = event.target.uploadFile.files;
    console.log(file);
    let fromdata = new FormData();

    fromdata.append("file",file[0]);

    axios({
        method : "post",
        url :"http://localhost:8000/upload",
        data : fromdata
    }).then(function (res) {
        $("#link").html(res.data);
        event.target.uploadFile.value("");
    })
}