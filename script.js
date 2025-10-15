// --- BANCO DE DADOS SIMULADO (SEUS PRODUTOS) ---
const products = [
    // O id do produto deve ser único. Usar strings pode ser mais robusto no futuro.
    { id: 1, name: 'Vaso Geométrico', price: 49.90, category: 'decoracao', image: 'images/produto1.jpg', shortDescription: 'Design moderno para sua casa.', description: 'Um vaso elegante com design geométrico, perfeito para decorar qualquer ambiente. Feito com material PLA biodegradável de alta resistência. Disponível em várias cores.', gallery: [ 'images/produto1.jpg', 'images/produto1_lado.jpg', 'images/produto1_detalhe.jpg' ]},
    { id: 2, name: 'Action Figure - Herói', price: 89.90, category: 'figuras', image: 'images/produto2.jpg', shortDescription: 'Para colecionadores exigentes.', description: 'Action figure detalhado do seu herói favorito. Impresso em resina de alta qualidade para capturar todos os detalhes. Ideal para colecionadores e fãs.', gallery: [ 'images/produto2.jpg', 'images/produto2_costas.jpg', 'images/produto2_zoom.jpg' ]},
    { id: 3, name: 'Suporte para Headset', price: 35.50, category: 'utilitarios', image: 'images/produto3.jpg', shortDescription: 'Organize seu setup com estilo.', description: 'Mantenha seu setup organizado com este suporte moderno para headset. Design minimalista que economiza espaço e protege seu equipamento.', gallery: [ 'images/produto3.jpg' ]},
    { id: 4, name: 'Chaveiro Personalizado', price: 15.00, category: 'utilitarios', image: 'images/produto4.jpg', shortDescription: 'Leve seu estilo com você.', description: 'Leve um chaveiro com seu nome, logo ou personagem favorito. Uma ótima opção para presente! Entre em contato para personalizações.', gallery: [ 'images/produto4.jpg' ]}
];
let cart = [];

// --- ELEMENTOS DO DOM ---
const homePage = document.getElementById('home-page');
const shopPage = document.getElementById('shop-page');
const themeToggle = document.getElementById('theme-toggle');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const registerModal = document.getElementById('register-modal');
const loginModal = document.getElementById('login-modal');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const productGrid = document.getElementById('product-grid');
const featuredProductsGrid = document.getElementById('featured-products-grid');
const cartModal = document.getElementById('cart-modal');

// --- FUNÇÕES DE NAVEGAÇÃO, BUSCA, E MODAIS DE AUTENTICAÇÃO ---
function showHomePage() { homePage.style.display = 'block'; shopPage.style.display = 'none'; window.scrollTo(0, 0); }
function showShopPage() { homePage.style.display = 'none'; shopPage.style.display = 'block'; window.scrollTo(0, 0); }
searchForm.addEventListener('submit', function(event) { event.preventDefault(); const searchTerm = searchInput.value.trim().toLowerCase(); if (!searchTerm) return; const searchResult = products.filter(product => product.name.toLowerCase().includes(searchTerm)); showShopPage(); renderProducts(searchResult, productGrid); if (searchResult.length === 0) { productGrid.innerHTML = `<p style="text-align: center; width: 100%; grid-column: 1 / -1;">Nenhum produto encontrado para "${searchInput.value}"</p>`; } document.querySelectorAll('#category-list li a').forEach(a => a.classList.remove('active')); });
function showRegisterModal() { registerModal.style.display = 'block'; }
function closeRegisterModal() { registerModal.style.display = 'none'; }
function showLoginModal() { loginModal.style.display = 'block'; }
function closeLoginModal() { loginModal.style.display = 'none'; }

// --- LÓGICA DE CADASTRO E LOGIN ---
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const response = await fetch('https://formspree.io/f/xovkyljp', { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
    if (response.ok) {
        const user = { nome: formData.get('nomeCompleto'), email: formData.get('email') };
        const avatarFile = document.getElementById('avatar-upload').files[0];
        if (avatarFile) {
            const reader = new FileReader();
            reader.onloadend = function() { user.avatar = reader.result; localStorage.setItem('loggedInUser', JSON.stringify(user)); updateUIForLoggedInUser(user); }
            reader.readAsDataURL(avatarFile);
        } else { localStorage.setItem('loggedInUser', JSON.stringify(user)); updateUIForLoggedInUser(user); }
        alert('Cadastro realizado com sucesso!');
        closeRegisterModal();
    } else { alert('Ocorreu um erro. Tente novamente.'); }
});
loginForm.addEventListener('submit', function(event) { event.preventDefault(); const email = document.getElementById('login-email').value; const storedUser = JSON.parse(localStorage.getItem('loggedInUser')); if (storedUser && storedUser.email === email) { alert(`Bem-vindo(a) de volta, ${storedUser.nome}!`); updateUIForLoggedInUser(storedUser); closeLoginModal(); } else { alert('Usuário não encontrado. Verifique o e-mail ou cadastre-se.'); } });
function updateUIForLoggedInUser(user) { document.querySelectorAll('.auth-link').forEach(link => link.style.display = 'none'); const profileArea = document.getElementById('user-profile-area'); document.getElementById('welcome-message').innerText = `Olá, ${user.nome.split(' ')[0]}`; profileArea.style.display = 'flex'; const avatarDiv = document.getElementById('user-avatar'); if (user.avatar) { document.getElementById('avatar-pic').src = user.avatar; avatarDiv.style.display = 'block'; } }
function logout() { localStorage.removeItem('loggedInUser'); document.querySelectorAll('.auth-link').forEach(link => link.style.display = 'inline'); document.getElementById('user-profile-area').style.display = 'none'; document.getElementById('user-avatar').style.display = 'none'; alert('Você saiu da sua conta.'); }
function checkLoginStatus() { const storedUser = JSON.parse(localStorage.getItem('loggedInUser')); if (storedUser) { updateUIForLoggedInUser(storedUser); } }

// --- LÓGICA DO CARROSSEL DE BANNERS ---
const slider = document.querySelector('.slider'), slides = document.querySelectorAll('.slide'), prevBtn = document.getElementById('prevBtn'), nextBtn = document.getElementById('nextBtn'); let currentIndex = 0, autoSlide; const slideInterval = 5000;
function goToSlide(index) { if (slides.length === 0) return; if (index < 0) index = slides.length - 1; else if (index >= slides.length) index = 0; slider.style.transform = `translateX(-${index * 100}%)`; currentIndex = index; }
function startAutoSlide() { stopAutoSlide(); autoSlide = setInterval(() => goToSlide(currentIndex + 1), slideInterval); }
function stopAutoSlide() { clearInterval(autoSlide); }
nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); startAutoSlide(); });
prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); startAutoSlide(); });

// --- LÓGICA DO SELETOR DE TEMA ---
const currentTheme = localStorage.getItem('theme');
if (currentTheme) { document.body.setAttribute('data-theme', currentTheme); if (currentTheme === 'dark') themeToggle.checked = true; }
themeToggle.addEventListener('change', function() { const theme = this.checked ? 'dark' : 'light'; document.body.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); });

// --- FUNÇÕES DA LOJA ---
function renderProducts(productsToRender, containerElement) {
    if (!containerElement) return;
    
    // É mais performático construir a string HTML e depois atribuir ao innerHTML de uma vez.
    const productsHTML = productsToRender.map(product => `
            <div class="card" data-product-id="${product.id}">
                <div class="card__shine"></div><div class="card__glow"></div>
                <div class="card__content">
                    <div class="card__image"><img src="${product.image}" alt="${product.name}"></div>
                    <div class="card__text"><p class="card__title">${product.name}</p><p class="card__description">${product.shortDescription}</p></div>
                    <div class="card__footer">
                        <div class="card__price">R$ ${product.price.toFixed(2)}</div>
                        <div class="card__button" data-product-id="${product.id}">
                            <svg height="16" width="16" viewBox="0 0 24 24"><path stroke-width="2" stroke="currentColor" d="M4 12H20M12 4V20" fill="currentColor"></path></svg>
                        </div>
                    </div>
                </div>
            </div>`
    ).join('');

    containerElement.innerHTML = productsHTML;
}
function filterProducts(category) { showShopPage(); document.querySelectorAll('#category-list li a').forEach(a => a.classList.remove('active')); const activeLink = document.querySelector(`#category-list li a[onclick="filterProducts('${category}')"]`); if(activeLink) activeLink.classList.add('active'); const productsToDisplay = category === 'todos' ? products : products.filter(p => p.category === category); renderProducts(productsToDisplay, 'product-grid'); }

// --- FUNÇÕES DE DETALHES DO PRODUTO, CARRINHO E CHECKOUT ---
function showProductDetail(productId) { const product = products.find(p => p.id === productId); if (!product) return; document.getElementById('product-detail-main-image').src = product.gallery[0]; document.getElementById('product-detail-name').innerText = product.name; document.getElementById('product-detail-price').innerText = `R$ ${product.price.toFixed(2)}`; document.getElementById('product-detail-description').innerText = product.description; document.getElementById('detail-add-to-cart-btn').onclick = () => { addToCart(product.id); closeProductDetail(); }; const galleryContainer = document.getElementById('product-detail-gallery'); galleryContainer.innerHTML = ''; product.gallery.forEach((imgSrc, index) => { const thumb = document.createElement('img'); thumb.src = imgSrc; thumb.classList.add('thumbnail'); if (index === 0) thumb.classList.add('active'); thumb.onclick = () => changeMainImage(imgSrc, thumb); galleryContainer.appendChild(thumb); }); document.getElementById('product-detail-modal').style.display = 'block'; }
function changeMainImage(newSrc, clickedThumb) { document.getElementById('product-detail-main-image').src = newSrc; document.querySelectorAll('.thumbnail-gallery .thumbnail').forEach(t => t.classList.remove('active')); clickedThumb.classList.add('active'); }
function closeProductDetail() { document.getElementById('product-detail-modal').style.display = 'none'; }
function addToCart(productId) { const productInCart = cart.find(item => item.id === productId); if (productInCart) productInCart.quantity++; else cart.push({ ...products.find(p => p.id === productId), quantity: 1 }); const cartIcon = document.querySelector('.cart-icon'); cartIcon.classList.add('shake'); setTimeout(() => cartIcon.classList.remove('shake'), 500); updateCartDisplay(); }
function updateCartDisplay() { const cartItemsContainer = document.getElementById('cart-items'), cartTotalElement = document.getElementById('cart-total'), cartCountElement = document.getElementById('cart-count'); cartItemsContainer.innerHTML = ''; let total = 0, totalItems = 0; cart.forEach(item => { cartItemsContainer.innerHTML += `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div class="cart-item-details"><p>${item.name}</p><p>R$ ${item.price.toFixed(2)}</p></div><div class="quantity-controls"><button onclick="decreaseQuantity(${item.id})">-</button><span>${item.quantity}</span><button onclick="increaseQuantity(${item.id})">+</button></div><button class="remove-item-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button></div>`; total += item.price * item.quantity; totalItems += item.quantity; }); cartTotalElement.innerText = total.toFixed(2); cartCountElement.innerText = totalItems; }
function increaseQuantity(productId) { cart.find(item => item.id === productId).quantity++; updateCartDisplay(); }
function decreaseQuantity(productId) { const item = cart.find(i => i.id === productId); if (item.quantity > 1) item.quantity--; else removeFromCart(productId); updateCartDisplay(); }
function removeFromCart(productId) { cart = cart.filter(item => item.id !== productId); updateCartDisplay(); }
function toggleCart() { const cartModal = document.getElementById('cart-modal'); cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block'; if (cartModal.style.display === 'block') updateCartDisplay(); }
function showCheckout() { if (cart.length === 0) return alert("Seu carrinho está vazio!"); document.getElementById('cart-modal').style.display = 'none'; document.getElementById('checkout-modal').style.display = 'block'; }
function closeCheckout() { document.getElementById('checkout-modal').style.display = 'none'; }
document.getElementById('checkout-form').addEventListener('submit', function(event) { event.preventDefault(); document.getElementById('submit-checkout-btn').style.display = 'none'; document.getElementById('payment-step').style.display = 'block'; generateOrderSummary(); });
function generateOrderSummary() { const name = document.getElementById('name').value, phone = document.getElementById('phone').value, address = document.getElementById('address').value, city = document.getElementById('city').value, zipcode = document.getElementById('zipcode').value; const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0); let summary = `--- NOVO PEDIDO ---\n\n*Cliente:* ${name}\n*Telefone:* ${phone}\n*Endereço:* ${address}, ${city} - CEP: ${zipcode}\n\n*Itens do Pedido:*\n`; cart.forEach(item => { summary += `- ${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)})\n`; }); summary += `\n*TOTAL:* R$ ${total.toFixed(2)}`; document.getElementById('order-summary').value = summary; }
function sendOrderToWhatsApp() { const summaryText = document.getElementById('order-summary').value; const encodedText = encodeURIComponent(summaryText); const yourNumber = '5511999999999'; const whatsappURL = `https://wa.me/${yourNumber}?text=${encodedText}`; window.open(whatsappURL, '_blank'); }

// --- LÓGICA DO BANNER DE COOKIES ---
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
    const closeCookiesBtn = document.getElementById('close-cookies-btn');
    const hideBanner = () => { cookieBanner.classList.remove('show'); };
    const acceptCookies = () => { localStorage.setItem('cookieConsentGiven', 'true'); hideBanner(); };
    acceptCookiesBtn.addEventListener('click', acceptCookies);
    if(closeCookiesBtn) closeCookiesBtn.addEventListener('click', hideBanner);
    setTimeout(() => { if (!localStorage.getItem('cookieConsentGiven')) { cookieBanner.classList.add('show'); } }, 2000);

    // --- DELEGAÇÃO DE EVENTOS ---
    // Adiciona eventos aos produtos de forma mais eficiente
    function handleProductClick(event) {
        const card = event.target.closest('.card');
        const button = event.target.closest('.card__button');

        if (button) {
            event.stopPropagation(); // Impede que o clique no botão abra o detalhe do produto
            const productId = button.dataset.productId;
            addToCart(productId);
        } else if (card) {
            const productId = card.dataset.productId;
            showProductDetail(parseInt(productId));
        }
    }

    featuredProductsGrid.addEventListener('click', handleProductClick);
    productGrid.addEventListener('click', handleProductClick);
});

// --- INICIALIZAÇÃO ---
window.onload = function() {
    const featuredProducts = products.slice(0, 4);
    renderProducts(featuredProducts, featuredProductsGrid);
    renderProducts(products, productGrid);
    showHomePage();
    if(slides.length > 1) startAutoSlide();
    checkLoginStatus();
};