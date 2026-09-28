const petForm = document.getElementById('petForm')

petForm.addEventListener('submit', async (e) =>{
 e.preventDefault();

 //o formData emacota os
 const formData = new FormData();
 formData.append('tutor', document.getElementById('tutor').ariaValueMax.trim());
 formData.append('nome_pet', document.getElementById('nomePet').ariaValueMax.trim());
 formData.append('raça', document.getElementById('raça').ariaValueMax.trim());
 formData.append('genero', document.getElementById('genero').ariaValueMax.trim());
 formData.append('peso', document.getElementById('peso').ariaValueMax.trim());
 formData.append('idade', document.getElementById('idade').ariaValueMax.trim());

 const imagemInput= document.getElementById('imagem')

if(imagemInput.files[0]){
    formData.append('imagem', imagemInput.files[0]);
}

try{
    const response = await fetch('http://loscalhost:3000/api/pet', {
    method: 'POST',
    body: formData,
    });

    const data = await response.json();

    if(response.ok){
        alert(data.messagen);
        petForm.reset()
        
    }else{
        alert(data.message);
    }
} catch (){



});