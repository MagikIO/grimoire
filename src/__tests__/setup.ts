import { beforeEach, afterEach } from 'vitest';

// Clean up DOM between tests
beforeEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

// Mock fonts for ESig component
const mockFonts = `
@font-face {
  font-family: 'Dancing Script';
  src: local('Arial');
}
@font-face {
  font-family: 'Great Vibes';
  src: local('Arial');
}
@font-face {
  font-family: 'Homemade Apple';
  src: local('Arial');
}
@font-face {
  font-family: 'Marck Script';
  src: local('Arial');
}
@font-face {
  font-family: 'Sacramento';
  src: local('Arial');
}
@font-face {
  font-family: 'Satisfy';
  src: local('Arial');
}
`;

const style = document.createElement('style');
style.textContent = mockFonts;
document.head.appendChild(style);
