@@ .. @@
 (function () {
+    // Initialize course data and search
+    document.addEventListener('DOMContentLoaded', () => {
+        // Initialize search if on programs page
+        if (document.getElementById('programSearchForm')) {
+            new SearchManager('programSearchForm', 'programSearchInput', 'searchResults');
+        }
+    });
+    
     const qs = (sel, el = document) => el.querySelector(sel);
     const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));
 
@@ .. @@
     // Filter cards based on query
     const filterPrograms = (query) => {
         const q = query.trim().toLowerCase();
         let visible = 0;
 
         cards.forEach(card => {
             const title = (card.dataset.title || '').toLowerCase();
             const keywords = (card.dataset.keywords || '').toLowerCase();
+            const desc = (card.dataset.desc || '').toLowerCase();
-            const match = !q || title.includes(q) || keywords.includes(q);
+            const match = !q || title.includes(q) || keywords.includes(q) || desc.includes(q);
             card.classList.toggle('d-none', !match);
             if (match) visible += 1;
         });
@@ .. @@
     // Initialize from URL
     applyQueryFromURL();
 })();
 
 (() => {
     // Tab deep-linking via hash
     const tabTriggerEls = document.querySelectorAll('#authTabs [data-bs-toggle="pill"]');
     const tabMap = new Map();
     tabTriggerEls.forEach(btn => {
         const target = btn.getAttribute('data-bs-target');
         if (target) tabMap.set(target, btn);
         btn.addEventListener('shown.bs.tab', () => history.replaceState({}, '', target));
     });
     const initialHash = location.hash;
     if (initialHash && tabMap.has(initialHash)) {
         const btn = tabMap.get(initialHash);
         const tab = new bootstrap.Tab(btn);
         tab.show();
     }
 
     // Bootstrap validation pattern
     // https://getbootstrap.com/docs/5.3/forms/validation/
     const forms = document.querySelectorAll('.needs-validation');
     Array.from(forms).forEach(form => {
         form.addEventListener('submit', (e) => {
             // Custom password confirmation checks
             const pw = form.querySelector('input[name="password"]');
             const cpw = form.querySelector('input[name="confirm_password"]');
             if (pw && cpw) {
                 if (cpw.value.trim() !== pw.value.trim()) {
                     cpw.setCustomValidity('Passwords do not match');
                 } else {
                     cpw.setCustomValidity('');
                 }
             }
 
             if (!form.checkValidity()) {
                 e.preventDefault();
                 e.stopPropagation();
             }
             form.classList.add('was-validated');
         });
 
         // Live validation of confirm password field
         const pw = form.querySelector('input[name="password"]');
         const cpw = form.querySelector('input[name="confirm_password"]');
         if (pw && cpw) {
             const sync = () => {
                 if (cpw.value.trim() !== pw.value.trim()) {
                     cpw.setCustomValidity('Passwords do not match');
                 } else {
                     cpw.setCustomValidity('');
                 }
             };
             pw.addEventListener('input', sync);
             cpw.addEventListener('input', sync);
         }
     });
 
     // Accessible password reveal toggles
     // Based on common a11y recommendations: use a toggle button with aria-pressed and aria-controls
     const toggles = document.querySelectorAll('.password-toggle[aria-controls]');
     toggles.forEach(btn => {
         btn.addEventListener('click', () => {
             const controlId = btn.getAttribute('aria-controls');
             const input = document.getElementById(controlId);
             if (!input) return;
 
             const pressed = btn.getAttribute('aria-pressed') === 'true';
             const nextPressed = !pressed;
             btn.setAttribute('aria-pressed', String(nextPressed));
 
             const isPassword = input.type === 'password';
             input.type = isPassword ? 'text' : 'password';
 
             // Update icon and accessible name
             const icon = btn.querySelector('i');
             if (icon) {
                 icon.classList.toggle('bi-eye', !nextPressed);
                 icon.classList.toggle('bi-eye-slash', nextPressed);
             }
             btn.setAttribute('aria-label', nextPressed ? 'Hide password' : 'Show password');
 
             // Keep security-friendly defaults
             input.setAttribute('spellcheck', 'false');
             // Optionally prevent paste on sensitive fields:
             // input.addEventListener('paste', (e) => e.preventDefault());
         });
     });
 })();