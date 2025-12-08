// Script de test pentru debugging header pe checkout
// Copie în browser console pe pagina http://localhost:3000/checkout

console.log('=== CHECKOUT HEADER DEBUG ===');

const header = document.querySelector('header');
if (header) {
  const styles = window.getComputedStyle(header);
  console.log('Header z-index:', styles.zIndex);
  console.log('Header pointer-events:', styles.pointerEvents);
  console.log('Header position:', styles.position);
  
  const rect = header.getBoundingClientRect();
  console.log('Header position:', {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  });
}

// Verifică toate elementele fixed/sticky cu z-index mare
const allElements = document.querySelectorAll('*');
const highZElements = [];
allElements.forEach(el => {
  const styles = window.getComputedStyle(el);
  const zIndex = parseInt(styles.zIndex);
  const position = styles.position;
  
  if ((position === 'fixed' || position === 'sticky' || position === 'absolute') && zIndex > 40) {
    highZElements.push({
      element: el,
      tag: el.tagName,
      class: el.className,
      zIndex: zIndex,
      position: position,
      pointerEvents: styles.pointerEvents
    });
  }
});

console.log('Elemente cu z-index mare:', highZElements);

// Verifică dacă există overlay-uri active
const overlays = document.querySelectorAll('[class*="fixed"][class*="inset"]');
console.log('Overlay-uri găsite:', overlays.length);
overlays.forEach((overlay, i) => {
  const styles = window.getComputedStyle(overlay);
  console.log(`Overlay ${i}:`, {
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    pointerEvents: styles.pointerEvents,
    zIndex: styles.zIndex
  });
});

// Test click pe meniu
console.log('\n=== Click pe primul link din meniu ===');
const firstNavLink = document.querySelector('nav a');
if (firstNavLink) {
  console.log('Link găsit:', firstNavLink.textContent);
  console.log('Link clickabil?', window.getComputedStyle(firstNavLink).pointerEvents !== 'none');
}
