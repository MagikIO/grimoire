# Grimoire Examples

Practical examples and recipes for using Grimoire components.

## Table of Contents

- [Basic Setup](#basic-setup)
- [SlideToggle Examples](#slidetoggle-examples)
- [ESig Examples](#esig-examples)
- [Theming Examples](#theming-examples)
- [Advanced Patterns](#advanced-patterns)
- [Real-World Use Cases](#real-world-use-cases)

---

## Basic Setup

### Minimal HTML Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grimoire Example</title>
</head>
<body>
  <slide-toggle label="Dark Mode" checked="false"></slide-toggle>

  <script type="module">
    import { Grimoire } from '@magik_io/grimoire';
    await Grimoire.Define('slide-toggle');
  </script>
</body>
</html>
```

### With CDN (if available)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grimoire via CDN</title>
</head>
<body>
  <slide-toggle label="Enable" checked="true"></slide-toggle>

  <script type="module">
    import { Grimoire } from 'https://unpkg.com/@magik_io/grimoire';
    await Grimoire.Define('slide-toggle');
  </script>
</body>
</html>
```

### With Build Tools (Vite/Webpack)

**Install:**
```bash
pnpm add @magik_io/grimoire
```

**JavaScript:**
```javascript
import { Grimoire } from '@magik_io/grimoire';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await Grimoire.Configure({ chroma: 'class' });
  await Grimoire.Define('slide-toggle', 'e-sig');
});
```

**HTML:**
```html
<slide-toggle label="Subscribe" checked="false"></slide-toggle>
<e-sig>Your Name</e-sig>
```

---

## SlideToggle Examples

### Basic Toggle

```html
<slide-toggle label="Accept Terms"></slide-toggle>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('slide-toggle');
</script>
```

### Pre-checked Toggle

```html
<slide-toggle
  label="Remember me"
  checked="true"
  name="remember">
</slide-toggle>
```

### With Change Event

```html
<slide-toggle
  label="Enable notifications"
  id="notificationToggle">
</slide-toggle>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('slide-toggle');

  const toggle = document.getElementById('notificationToggle');
  toggle.addEventListener('change', (e) => {
    if (e.detail.checked) {
      console.log('Notifications enabled');
      // Request notification permission
      Notification.requestPermission();
    } else {
      console.log('Notifications disabled');
    }
  });
</script>
```

### Form Integration

```html
<form id="settingsForm">
  <div>
    <slide-toggle
      label="Email notifications"
      name="emailNotifications"
      checked="true">
    </slide-toggle>
  </div>

  <div>
    <slide-toggle
      label="SMS notifications"
      name="smsNotifications"
      checked="false">
    </slide-toggle>
  </div>

  <button type="submit">Save Settings</button>
</form>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('slide-toggle');

  const form = document.getElementById('settingsForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const settings = {
      emailNotifications: formData.get('emailNotifications') === 'on',
      smsNotifications: formData.get('smsNotifications') === 'on'
    };

    console.log('Settings:', settings);
    // Send to server
  });
</script>
```

### Programmatic Control

```html
<slide-toggle
  label="Auto-save"
  id="autoSaveToggle">
</slide-toggle>

<button id="enableBtn">Enable Auto-save</button>
<button id="disableBtn">Disable Auto-save</button>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('slide-toggle');

  const toggle = document.getElementById('autoSaveToggle');
  const enableBtn = document.getElementById('enableBtn');
  const disableBtn = document.getElementById('disableBtn');

  enableBtn.addEventListener('click', () => {
    toggle.activated = true;
  });

  disableBtn.addEventListener('click', () => {
    toggle.activated = false;
  });

  // Listen for changes from any source
  toggle.addEventListener('change', (e) => {
    console.log('Auto-save is now:', e.detail.checked);
  });
</script>
```

### Custom Styled Toggle

```html
<style>
  .premium-toggle {
    --st-checked-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --st-border-width: 2px;
    --st-border-color: rgba(102, 126, 234, 0.5);
  }

  .success-toggle {
    --st-checked-bg: #10b981;
    --st-border-color: #10b981;
  }

  .danger-toggle {
    --st-checked-bg: #ef4444;
    --st-border-color: #ef4444;
  }
</style>

<slide-toggle
  class="premium-toggle"
  label="Premium Features">
</slide-toggle>

<slide-toggle
  class="success-toggle"
  label="Active">
</slide-toggle>

<slide-toggle
  class="danger-toggle"
  label="Critical Mode">
</slide-toggle>
```

### Disabled State (Custom Implementation)

```html
<slide-toggle
  label="Locked Feature"
  id="lockedToggle">
</slide-toggle>

<style>
  .toggle-disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }
</style>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('slide-toggle');

  const toggle = document.getElementById('lockedToggle');
  toggle.classList.add('toggle-disabled');
</script>
```

---

## ESig Examples

### Basic Signature

```html
<link href="https://fonts.googleapis.com/css?family=Dancing+Script|Great+Vibes|Homemade+Apple|Marck+Script|Sacramento|Satisfy" rel="stylesheet">

<e-sig>John Smith</e-sig>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('e-sig');
</script>
```

### With Custom Font

```html
<e-sig font="great-vibes">
  Dr. Jane Doe
</e-sig>
```

### With Custom Icon

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<e-sig
  font="sacramento"
  icon="fas fa-pen">
  Antonio Bourassa
</e-sig>
```

### Contract Signature

```html
<div class="contract">
  <h2>Terms and Conditions</h2>
  <p>By signing below, you agree to...</p>

  <div class="signature-block">
    <label>Signature:</label>
    <e-sig font="dancing-script">
      John Q. Public
    </e-sig>

    <label>Date:</label>
    <span id="signatureDate"></span>
  </div>
</div>

<style>
  .contract {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .signature-block {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #000;
  }

  .signature-block label {
    display: block;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  e-sig {
    display: block;
    width: 100%;
  }
</style>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('e-sig');

  // Set current date
  document.getElementById('signatureDate').textContent =
    new Date().toLocaleDateString();
</script>
```

### Multiple Signatures

```html
<div class="multi-signature">
  <div class="sig-row">
    <div class="sig-column">
      <label>Employee:</label>
      <e-sig font="dancing-script">Alice Johnson</e-sig>
      <small>Date: <span class="date"></span></small>
    </div>

    <div class="sig-column">
      <label>Manager:</label>
      <e-sig font="marck-script">Bob Williams</e-sig>
      <small>Date: <span class="date"></span></small>
    </div>
  </div>

  <div class="sig-row">
    <div class="sig-column">
      <label>Director:</label>
      <e-sig font="sacramento">Carol Davis</e-sig>
      <small>Date: <span class="date"></span></small>
    </div>

    <div class="sig-column">
      <label>Witness:</label>
      <e-sig font="satisfy">David Brown</e-sig>
      <small>Date: <span class="date"></span></small>
    </div>
  </div>
</div>

<style>
  .multi-signature {
    max-width: 800px;
    margin: 2rem auto;
  }

  .sig-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .sig-column {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .sig-column label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .sig-column small {
    display: block;
    margin-top: 0.5rem;
    color: #666;
  }
</style>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('e-sig');

  // Set dates
  const dateElements = document.querySelectorAll('.date');
  const today = new Date().toLocaleDateString();
  dateElements.forEach(el => el.textContent = today);
</script>
```

### Custom Styled Signature

```html
<style>
  .elegant-sig {
    --eSig-bg: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
    --eSig-border-color: #8b7355;
    --eSig-border-width: 2px;
    --eSig-border-radius: 8px;
    --eSig-padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .digital-sig {
    --eSig-bg: #1e293b;
    --eSig-border-color: #3b82f6;
    --eSig-color: #3b82f6;
    --eSig-border-width: 2px;
    border-style: dashed;
  }
</style>

<e-sig class="elegant-sig" font="great-vibes">
  Elegant Signature
</e-sig>

<e-sig class="digital-sig" font="sacramento">
  Digital Signature
</e-sig>
```

### Dynamic Signature

```html
<input
  type="text"
  id="nameInput"
  placeholder="Enter your name"
  style="padding: 0.5rem; margin-bottom: 1rem; width: 100%;">

<e-sig id="dynamicSig" font="dancing-script">
  Your Name Here
</e-sig>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';
  await Grimoire.Define('e-sig');

  const input = document.getElementById('nameInput');
  const sig = document.getElementById('dynamicSig');

  input.addEventListener('input', (e) => {
    const name = e.target.value.trim() || 'Your Name Here';
    sig.textContent = name;
  });
</script>
```

---

## Theming Examples

### Browser-Based Theme (Default)

```html
<script type="module">
  import { Grimoire } from '@magik_io/grimoire';

  // Uses system preference
  Grimoire.Configure({ chroma: 'browser' });
  await Grimoire.Define('slide-toggle', 'e-sig');
</script>
```

### Class-Based Theme Toggle

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Theme Toggle</title>
  <style>
    body.light {
      background: #ffffff;
      color: #000000;
    }

    body.dark {
      background: #1a1a1a;
      color: #ffffff;
    }
  </style>
</head>
<body class="light">
  <slide-toggle
    label="Dark Mode"
    id="themeToggle"
    checked="false">
  </slide-toggle>

  <e-sig>John Doe</e-sig>

  <script type="module">
    import { Grimoire } from '@magik_io/grimoire';

    Grimoire.Configure({ chroma: 'class' });
    await Grimoire.Define('slide-toggle', 'e-sig');

    const toggle = document.getElementById('themeToggle');
    toggle.addEventListener('change', (e) => {
      if (e.detail.checked) {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
    });
  </script>
</body>
</html>
```

### Custom Theme Classes

```html
<style>
  body.ocean-theme {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
  }

  body.sunset-theme {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: #ffffff;
  }
</style>

<body class="ocean-theme">
  <select id="themeSelector">
    <option value="ocean-theme">Ocean</option>
    <option value="sunset-theme">Sunset</option>
  </select>

  <slide-toggle label="Toggle"></slide-toggle>

  <script type="module">
    import { Grimoire } from '@magik_io/grimoire';

    Grimoire.Configure({
      chroma: {
        dark: 'ocean-theme',
        light: 'sunset-theme'
      }
    });
    await Grimoire.Define('slide-toggle');

    const selector = document.getElementById('themeSelector');
    selector.addEventListener('change', (e) => {
      document.body.className = e.target.value;
    });
  </script>
</body>
```

### Per-Component Theme Override

```html
<style>
  /* Global theme */
  :root {
    --st-checked-bg: #0d6efd;
  }

  /* Component-specific override */
  .success-toggle {
    --st-checked-bg: #10b981;
  }

  .warning-toggle {
    --st-checked-bg: #f59e0b;
  }

  .error-toggle {
    --st-checked-bg: #ef4444;
  }
</style>

<slide-toggle label="Default" checked="true"></slide-toggle>
<slide-toggle class="success-toggle" label="Success" checked="true"></slide-toggle>
<slide-toggle class="warning-toggle" label="Warning" checked="true"></slide-toggle>
<slide-toggle class="error-toggle" label="Error" checked="true"></slide-toggle>
```

---

## Advanced Patterns

### Loading Components on Demand

```html
<button id="loadToggle">Load Toggle Component</button>
<div id="toggleContainer"></div>

<button id="loadSig">Load Signature Component</button>
<div id="sigContainer"></div>

<script type="module">
  import { Grimoire } from '@magik_io/grimoire';

  document.getElementById('loadToggle').addEventListener('click', async () => {
    await Grimoire.Define('slide-toggle');
    document.getElementById('toggleContainer').innerHTML =
      '<slide-toggle label="Loaded!"></slide-toggle>';
  });

  document.getElementById('loadSig').addEventListener('click', async () => {
    await Grimoire.Define('e-sig');
    document.getElementById('sigContainer').innerHTML =
      '<e-sig>Signature Loaded</e-sig>';
  });
</script>
```

### State Management Integration

```html
<script type="module">
  import { Grimoire } from '@magik_io/grimoire';

  await Grimoire.Define('slide-toggle');

  // Simple state manager
  class AppState {
    constructor() {
      this.state = {
        notifications: false,
        darkMode: false,
        autoSave: true
      };
      this.listeners = [];
    }

    setState(updates) {
      this.state = { ...this.state, ...updates };
      this.listeners.forEach(fn => fn(this.state));
    }

    subscribe(fn) {
      this.listeners.push(fn);
    }
  }

  const appState = new AppState();

  // Bind toggles to state
  const notifToggle = document.querySelector('[name="notifications"]');
  const darkModeToggle = document.querySelector('[name="darkMode"]');

  notifToggle.addEventListener('change', (e) => {
    appState.setState({ notifications: e.detail.checked });
  });

  darkModeToggle.addEventListener('change', (e) => {
    appState.setState({ darkMode: e.detail.checked });
  });

  // React to state changes
  appState.subscribe((state) => {
    console.log('State updated:', state);
    // Sync with server, localStorage, etc.
    localStorage.setItem('appState', JSON.stringify(state));
  });
</script>
```

### TypeScript Integration

```typescript
import { Grimoire, type GrimoireTemplateNames } from '@magik_io/grimoire';

interface AppSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSave: boolean;
}

class SettingsManager {
  private settings: AppSettings = {
    theme: 'light',
    notifications: true,
    autoSave: true
  };

  async initialize(): Promise<void> {
    await Grimoire.Configure({ chroma: 'class' });
    await Grimoire.Define('slide-toggle');

    this.bindToggles();
    this.loadSettings();
  }

  private bindToggles(): void {
    const notifToggle = document.querySelector<SlideToggle>('[name="notifications"]');
    const autoSaveToggle = document.querySelector<SlideToggle>('[name="autoSave"]');

    notifToggle?.addEventListener('change', (e: CustomEvent<{checked: boolean}>) => {
      this.updateSetting('notifications', e.detail.checked);
    });

    autoSaveToggle?.addEventListener('change', (e: CustomEvent<{checked: boolean}>) => {
      this.updateSetting('autoSave', e.detail.checked);
    });
  }

  private updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): void {
    this.settings[key] = value;
    this.saveSettings();
  }

  private saveSettings(): void {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  private loadSettings(): void {
    const stored = localStorage.getItem('settings');
    if (stored) {
      this.settings = JSON.parse(stored);
    }
  }
}

// Usage
const manager = new SettingsManager();
await manager.initialize();
```

---

## Real-World Use Cases

### Settings Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>User Settings</title>
  <style>
    .settings-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .settings-section {
      margin-bottom: 2rem;
    }

    .settings-section h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .setting-item {
      padding: 1rem;
      background: white;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .setting-info {
      flex: 1;
    }

    .setting-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
    }

    .setting-info p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="settings-container">
    <h1>Settings</h1>

    <div class="settings-section">
      <h2>Notifications</h2>

      <div class="setting-item">
        <div class="setting-info">
          <h3>Email Notifications</h3>
          <p>Receive updates via email</p>
        </div>
        <slide-toggle name="emailNotif" checked="true"></slide-toggle>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <h3>Push Notifications</h3>
          <p>Receive push notifications in browser</p>
        </div>
        <slide-toggle name="pushNotif" checked="false"></slide-toggle>
      </div>
    </div>

    <div class="settings-section">
      <h2>Preferences</h2>

      <div class="setting-item">
        <div class="setting-info">
          <h3>Auto-save</h3>
          <p>Automatically save your work</p>
        </div>
        <slide-toggle name="autoSave" checked="true"></slide-toggle>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <h3>Dark Mode</h3>
          <p>Use dark color scheme</p>
        </div>
        <slide-toggle name="darkMode" id="darkModeToggle" checked="false"></slide-toggle>
      </div>
    </div>
  </div>

  <script type="module">
    import { Grimoire } from '@magik_io/grimoire';

    Grimoire.Configure({ chroma: 'class' });
    await Grimoire.Define('slide-toggle');

    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('settings') || '{}');

    Object.entries(savedSettings).forEach(([name, checked]) => {
      const toggle = document.querySelector(`[name="${name}"]`);
      if (toggle) toggle.activated = checked;
    });

    // Save on change
    document.querySelectorAll('slide-toggle').forEach(toggle => {
      toggle.addEventListener('change', () => {
        const settings = {};
        document.querySelectorAll('slide-toggle').forEach(t => {
          settings[t.getAttribute('name')] = t.activated;
        });
        localStorage.setItem('settings', JSON.stringify(settings));
      });
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', (e) => {
      document.body.classList.toggle('dark', e.detail.checked);
    });
  </script>
</body>
</html>
```

### Document Signing Flow

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document Signing</title>
  <link href="https://fonts.googleapis.com/css?family=Dancing+Script|Great+Vibes|Homemade+Apple|Marck+Script|Sacramento|Satisfy" rel="stylesheet">
  <style>
    .signing-flow {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .document {
      background: white;
      padding: 2rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .signature-section {
      border-top: 2px solid #000;
      padding-top: 2rem;
      margin-top: 2rem;
    }

    .signature-input {
      margin-bottom: 1rem;
    }

    .signature-input label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .signature-input input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
    }

    .signature-preview {
      margin: 1rem 0;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 4px;
    }

    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    button:hover {
      background: #2563eb;
    }

    button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <div class="signing-flow">
    <div class="document">
      <h1>Service Agreement</h1>
      <p>This agreement is entered into on <strong id="agreementDate"></strong>...</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>

      <div class="signature-section">
        <slide-toggle
          label="I have read and agree to the terms above"
          id="agreeToggle"
          checked="false">
        </slide-toggle>

        <div class="signature-input">
          <label>Full Name:</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter your full name"
            disabled>
        </div>

        <div class="signature-preview">
          <label>Preview Signature:</label>
          <e-sig id="signaturePreview" font="dancing-script">
            Your signature will appear here
          </e-sig>
        </div>

        <button id="signBtn" disabled>Sign Document</button>
      </div>
    </div>

    <div id="confirmation" style="display: none;">
      <h2>✓ Document Signed Successfully</h2>
      <p>Signed by: <strong id="signerName"></strong></p>
      <p>Date: <strong id="signedDate"></strong></p>
    </div>
  </div>

  <script type="module">
    import { Grimoire } from '@magik_io/grimoire';

    await Grimoire.Define('slide-toggle', 'e-sig');

    // Set agreement date
    document.getElementById('agreementDate').textContent =
      new Date().toLocaleDateString();

    const agreeToggle = document.getElementById('agreeToggle');
    const nameInput = document.getElementById('fullName');
    const signaturePreview = document.getElementById('signaturePreview');
    const signBtn = document.getElementById('signBtn');

    // Enable name input when terms are agreed
    agreeToggle.addEventListener('change', (e) => {
      nameInput.disabled = !e.detail.checked;
      if (!e.detail.checked) {
        nameInput.value = '';
        signaturePreview.textContent = 'Your signature will appear here';
        signBtn.disabled = true;
      }
    });

    // Update signature preview
    nameInput.addEventListener('input', (e) => {
      const name = e.target.value.trim();
      signaturePreview.textContent = name || 'Your signature will appear here';
      signBtn.disabled = !name || !agreeToggle.activated;
    });

    // Sign document
    signBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const date = new Date().toLocaleString();

      // Show confirmation
      document.querySelector('.document').style.display = 'none';
      const confirmation = document.getElementById('confirmation');
      confirmation.style.display = 'block';
      document.getElementById('signerName').textContent = name;
      document.getElementById('signedDate').textContent = date;

      // Save signature (in real app, send to server)
      const signatureData = {
        name,
        date,
        agreed: true,
        documentId: 'DOC-12345'
      };
      console.log('Document signed:', signatureData);
    });
  </script>
</body>
</html>
```

These examples should give you a comprehensive understanding of how to use Grimoire components in various scenarios!
