const resp = await fetch("http://localhost:3000/uploads")
const data = await resp.json()
console.log(data);

let index = 1

data.forEach(element => {

    const img = document.createElement("img")

    img.src = `/${element}`
    img.alt = `Galleriebild Nr. ${index}`
    img.style.width = "auto"
    img.style.height = "200px"

    index++

    document.querySelector(".gallery").appendChild(img)

});

document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault(); 
    
    await fetch("/upload", {
        method: "POST",
        body: new FormData(event.target)
    });
    
    location.reload(); 
});
