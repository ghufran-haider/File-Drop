function uplFile(event) {
    event.preventDefault();
    let file = event.target.uploadFile.files;
    let fromdata = new FormData();
    for (let index = 0; index < 3; index++) {
        fromdata.append("file",file[index]);
    }

    console.log(fromdata);
    
    axios({
        method : "post",
        url :"http://localhost:8000/upload",
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data : fromdata
    }).then(function (res) {
        $("#downloadLink").removeClass("d-none");
        console.log(res.data);
        let i=1;
        res.data.forEach(element => {

            $("#downloadLink").append(`<div class="d-flex justify-content-between align-items-center">
              <h6 style="margin-top: 10px;">${element.filename} : <span id="link_${i++}" style="color: blue !important;">${element.link}</span></h6>
              <label id="copytoclip_${i}" class="copy-custom-icon-label">
                <svg xmlns="http://www.w3.org/2000/svg"  width="10" height="10" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                </svg> </label>
            </div>`);
        });

        // $("#link").html(res.data);
    }).catch(function (err) {
        alert(err)
    })
}
$("#uploadFile").on("change",function () {
    let file = this.files;
    $("#files p").remove();
    $("#files").append(`<p id="fileNameDisplay">No file chosen</p>`);

    let length = file.length<=3?file.length:3;
    
    for (let i = 0; i < length ; i++) {
        const element = file[i];
        $("#fileNameDisplay").remove()
        $("#files").append(`<p>${element.name}</p>`);
    }
})