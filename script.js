const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const initialPhotos = [
  {
    id: "foto-001",
    title: "Casamento ao ar livre",
    category: "casamento",
    price: 39,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "foto-002",
    title: "Retrato editorial",
    category: "ensaio",
    price: 29,
    src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "foto-003",
    title: "Evento social",
    category: "evento",
    price: 34,
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "foto-004",
    title: "Making of",
    category: "video",
    price: 24,
    src: "https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "foto-005",
    title: "Ensaio urbano",
    category: "ensaio",
    price: 29,
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "foto-006",
    title: "Celebracao familiar",
    category: "evento",
    price: 34,
    src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=82",
  },
];

const state = {
  photos: loadPhotos(),
  cart: new Set(JSON.parse(localStorage.getItem("tita-cart") || "[]")),
  unlocked: new Set(JSON.parse(localStorage.getItem("tita-unlocked") || "[]")),
  filter: "todos",
};

const gallery = document.querySelector("[data-gallery]");
const filter = document.querySelector("[data-filter]");
const upload = document.querySelector("[data-upload]");
const cartDrawer = document.querySelector("[data-cart]");
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCount = document.querySelector("[data-cart-count]");
const toast = document.querySelector("[data-toast]");

document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
document.querySelector("[data-checkout]").addEventListener("click", checkout);

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

filter.addEventListener("change", (event) => {
  state.filter = event.target.value;
  renderGallery();
});

upload.addEventListener("change", addUploadedPhotos);

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Pedido registrado. Conecte este formulario ao WhatsApp ou e-mail da fotografa.");
  event.currentTarget.reset();
});

renderGallery();
renderCart();

function loadPhotos() {
  const saved = JSON.parse(localStorage.getItem("tita-photos") || "[]");
  return [...initialPhotos, ...saved];
}

function persist() {
  localStorage.setItem("tita-cart", JSON.stringify([...state.cart]));
  localStorage.setItem("tita-unlocked", JSON.stringify([...state.unlocked]));
}

function renderGallery() {
  const photos = state.photos.filter((photo) => {
    return state.filter === "todos" || photo.category === state.filter;
  });

  gallery.innerHTML = photos.map(createPhotoCard).join("");

  gallery.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });

  gallery.querySelectorAll("[data-preview]").forEach((button) => {
    button.addEventListener("click", () => previewPhoto(button.dataset.preview));
  });
}

function createPhotoCard(photo) {
  const selected = state.cart.has(photo.id);
  const unlocked = state.unlocked.has(photo.id);
  const actionText = unlocked ? "Liberada" : selected ? "Selecionada" : "Selecionar";

  return `
    <article class="photo-card ${unlocked ? "unlocked" : ""}">
      <div class="photo-frame ${unlocked ? "" : "locked"}">
        <img src="${photo.src}" alt="${photo.title}">
      </div>
      <div class="photo-meta">
        <div>
          <h3>${photo.title}</h3>
          <div class="photo-row">
            <span>${formatCategory(photo.category)}</span>
            <strong>${currency.format(photo.price)}</strong>
          </div>
        </div>
        <div class="photo-actions">
          <button type="button" data-add="${photo.id}" ${selected || unlocked ? "disabled" : ""}>${actionText}</button>
          <button type="button" data-preview="${photo.id}">Ver</button>
        </div>
      </div>
    </article>
  `;
}

function addToCart(id) {
  state.cart.add(id);
  persist();
  renderGallery();
  renderCart();
  showToast("Foto adicionada ao carrinho.");
}

function removeFromCart(id) {
  state.cart.delete(id);
  persist();
  renderGallery();
  renderCart();
}

function renderCart() {
  const photos = getCartPhotos();
  cartCount.textContent = photos.length;
  cartEmpty.hidden = photos.length > 0;
  cartItems.innerHTML = photos
    .map(
      (photo) => `
        <article class="cart-item">
          <img src="${photo.src}" alt="${photo.title}">
          <div>
            <strong>${photo.title}</strong>
            <span>${currency.format(photo.price)}</span>
          </div>
          <button type="button" data-remove="${photo.id}">Remover</button>
        </article>
      `
    )
    .join("");
  cartTotal.textContent = currency.format(photos.reduce((total, photo) => total + photo.price, 0));

  cartItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.remove));
  });
}

function checkout() {
  const photos = getCartPhotos();

  if (!photos.length) {
    showToast("Selecione pelo menos uma foto antes do pagamento.");
    return;
  }

  photos.forEach((photo) => state.unlocked.add(photo.id));
  state.cart.clear();
  persist();
  renderGallery();
  renderCart();
  closeCart();
  showToast("Pagamento simulado. Fotos liberadas sem marca d'agua.");
}

function getCartPhotos() {
  return [...state.cart]
    .map((id) => state.photos.find((photo) => photo.id === id))
    .filter(Boolean);
}

function addUploadedPhotos(event) {
  const files = [...event.target.files].filter((file) => file.type.startsWith("image/"));

  if (!files.length) return;

  const reads = files.map((file, index) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          id: `upload-${Date.now()}-${index}`,
          title: file.name.replace(/\.[^.]+$/, ""),
          category: "ensaio",
          price: 29,
          src: reader.result,
        });
      };
      reader.readAsDataURL(file);
    });
  });

  Promise.all(reads).then((newPhotos) => {
    const saved = JSON.parse(localStorage.getItem("tita-photos") || "[]");
    localStorage.setItem("tita-photos", JSON.stringify([...saved, ...newPhotos]));
    state.photos = loadPhotos();
    upload.value = "";
    renderGallery();
    showToast("Fotos adicionadas nesta galeria.");
  });
}

function previewPhoto(id) {
  const photo = state.photos.find((item) => item.id === id);
  if (!photo) return;
  showToast(state.unlocked.has(id) ? `${photo.title}: arquivo liberado.` : `${photo.title}: pre-visualizacao com marca d'agua.`);
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function formatCategory(category) {
  const names = {
    casamento: "Casamento",
    ensaio: "Ensaio",
    evento: "Evento",
    video: "Video",
  };

  return names[category] || category;
}
