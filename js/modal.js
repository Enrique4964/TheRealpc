const openCart = document.getElementById('button-cart');
const closeCart = document.getElementById('close-cart');

const containerModal = document.getElementsByClassName('modal')[0]
const modalCart = document.getElementsByClassName('modal-content')[0]

openCart.addEventListener('click', ()=> {
    containerModal.classList.toggle('modal-active')
})
closeCart.addEventListener('click', ()=> {
    containerModal.classList.toggle('modal-active')
})
modalCart.addEventListener('click',(e)=>{
    e.stopPropagation()
})
containerModal.addEventListener('click', ()=>{
    closeCart.click()
})