<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <button class="help-link" @click="$router.push('/how-it-works')">
        Besoin d’aide&nbsp;? <strong>En savoir plus sur notre programme</strong>
      </button>
      <p class="copy">© {{ year }} Mongulu Collective. Tous droits réservés.</p>
      <div class="links">
        <a href="#" @click.prevent>Confidentialité</a>
        <a href="#" @click.prevent>Conditions</a>
        <a href="#" @click.prevent>Support</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  padding: 28px 0 34px;
  text-align: center;
  border-top: 1px solid var(--border-soft);
}
.help-link {
  font-size: 13.5px;
  color: var(--ink-soft);
}
.help-link strong { color: var(--green); font-weight: 600; }
.help-link:hover strong { text-decoration: underline; }
.copy {
  margin-top: 12px;
  font-size: 12px;
  color: var(--ink-faint);
}
.links {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
.links a { font-size: 12.5px; color: var(--ink-faint); }
.links a:hover { color: var(--green); }
</style>
